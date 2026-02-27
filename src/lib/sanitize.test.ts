import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeText, sanitizeSectionContent } from './sanitize';

describe('sanitizeHtml', () => {
  it('strips script tags', () => {
    const input = '<p>Hello</p><script>alert("XSS")</script>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('<script');
    expect(output).not.toContain('alert');
    expect(output).toContain('<p>Hello</p>');
  });

  it('strips event handlers (onerror, onclick, etc.)', () => {
    const input = '<img src="x" onerror="alert(1)">';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('onerror');
    expect(output).not.toContain('alert');
  });

  it('strips onclick event handler', () => {
    const input = '<button onclick="doEvil()">Click</button>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('onclick');
    expect(output).not.toContain('doEvil');
  });

  it('allows safe tags (b, i, p, a, etc.)', () => {
    const input = '<p>Text with <b>bold</b> and <i>italic</i> and <a href="https://example.com">link</a></p>';
    const output = sanitizeHtml(input);
    expect(output).toContain('<p>');
    expect(output).toContain('<b>bold</b>');
    expect(output).toContain('<i>italic</i>');
    expect(output).toContain('<a');
    expect(output).toContain('href="https://example.com"');
  });

  it('allows headings and lists', () => {
    const input = '<h1>Title</h1><ul><li>Item 1</li><li>Item 2</li></ul>';
    const output = sanitizeHtml(input);
    expect(output).toContain('<h1>Title</h1>');
    expect(output).toContain('<ul>');
    expect(output).toContain('<li>Item 1</li>');
  });

  it('strips dangerous protocols from links', () => {
    const input = '<a href="javascript:alert(1)">Click</a>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('javascript:');
  });

  it('strips iframe tags', () => {
    const input = '<p>Content</p><iframe src="evil.com"></iframe>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('<iframe');
    expect(output).toContain('<p>Content</p>');
  });

  it('handles empty string input', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  it('strips form and input tags', () => {
    const input = '<form action="/steal"><input type="text" name="password"></form>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('<form');
    expect(output).not.toContain('<input');
  });

  it('strips object and embed tags', () => {
    const input = '<object data="evil.swf"></object><embed src="evil.swf">';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('<object');
    expect(output).not.toContain('<embed');
  });

  it('strips style tags', () => {
    const input = '<style>body { background: url("evil.com") }</style><p>Text</p>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('<style');
    expect(output).toContain('<p>Text</p>');
  });

  it('handles RTL/Hebrew text correctly', () => {
    const input = '<p>שלום עולם</p>';
    const output = sanitizeHtml(input);
    expect(output).toContain('שלום עולם');
    expect(output).toContain('<p>');
  });

  it('strips onmouseover event handler', () => {
    const input = '<div onmouseover="alert(1)">Hover me</div>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('onmouseover');
    expect(output).toContain('Hover me');
  });

  it('strips onload event handler from img', () => {
    const input = '<img src="valid.jpg" onload="alert(1)">';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('onload');
  });

  it('preserves allowed img attributes', () => {
    const input = '<img src="photo.jpg" alt="A photo" width="100" height="100">';
    const output = sanitizeHtml(input);
    expect(output).toContain('src="photo.jpg"');
    expect(output).toContain('alt="A photo"');
  });
});

describe('sanitizeText', () => {
  it('strips ALL HTML tags', () => {
    const input = '<p>Hello <b>world</b></p>';
    const output = sanitizeText(input);
    expect(output).not.toContain('<p>');
    expect(output).not.toContain('<b>');
    expect(output).toBe('Hello world');
  });

  it('removes script tags and content', () => {
    const input = 'Text<script>alert("XSS")</script>More text';
    const output = sanitizeText(input);
    expect(output).not.toContain('<script');
    expect(output).not.toContain('alert');
    expect(output).toContain('Text');
    expect(output).toContain('More text');
  });

  it('handles plain text without changes', () => {
    const input = 'Just plain text';
    const output = sanitizeText(input);
    expect(output).toBe('Just plain text');
  });

  it('removes event handlers', () => {
    const input = '<img src="x" onerror="alert(1)">Text';
    const output = sanitizeText(input);
    expect(output).not.toContain('onerror');
    expect(output).not.toContain('alert');
    expect(output).toContain('Text');
  });

  it('handles empty string', () => {
    expect(sanitizeText('')).toBe('');
  });

  it('handles RTL/Hebrew text', () => {
    const input = 'שלום <b>עולם</b>';
    const output = sanitizeText(input);
    expect(output).toBe('שלום עולם');
  });

  it('handles deeply nested HTML', () => {
    const input = '<div><div><div><p><span>Deep text</span></p></div></div></div>';
    const output = sanitizeText(input);
    expect(output).toBe('Deep text');
  });
});

describe('sanitizeSectionContent', () => {
  it('recursively sanitizes nested objects', () => {
    const input = {
      title: '<script>alert(1)</script>Title',
      content: {
        text: '<b>Bold</b> text',
        nested: {
          value: '<img src=x onerror="alert(1)">',
        },
      },
    };
    const output = sanitizeSectionContent(input);

    expect(output.title).not.toContain('<script');
    expect(output.title).toContain('Title');

    expect(output.content.text).toContain('<b>Bold</b>');

    expect(output.content.nested.value).not.toContain('onerror');
  });

  it('sanitizes arrays of strings', () => {
    const input = {
      items: [
        '<script>alert(1)</script>Item 1',
        '<b>Bold</b> item',
        'Plain item',
      ],
    };
    const output = sanitizeSectionContent(input);

    expect(output.items[0]).not.toContain('<script');
    expect(output.items[0]).toContain('Item 1');
    expect(output.items[1]).toContain('<b>Bold</b>');
    expect(output.items[2]).toBe('Plain item');
  });

  it('sanitizes arrays of objects', () => {
    const input = {
      sections: [
        { title: '<script>bad</script>Title 1', content: '<p>Content</p>' },
        { title: 'Title 2', content: '<img onerror="alert(1)">' },
      ],
    };
    const output = sanitizeSectionContent(input);

    expect(output.sections[0].title).not.toContain('<script');
    expect(output.sections[0].content).toContain('<p>Content</p>');
    expect(output.sections[1].content).not.toContain('onerror');
  });

  it('preserves non-string primitive values', () => {
    const input = {
      text: '<b>Bold</b>',
      number: 42,
      boolean: true,
      nullValue: null,
    };
    const output = sanitizeSectionContent(input);

    expect(output.text).toContain('<b>Bold</b>');
    expect(output.number).toBe(42);
    expect(output.boolean).toBe(true);
    expect(output.nullValue).toBe(null);
  });

  it('handles deeply nested structures', () => {
    const input = {
      level1: {
        level2: {
          level3: {
            text: '<script>evil</script>Deep text',
          },
        },
      },
    };
    const output = sanitizeSectionContent(input);

    expect(output.level1.level2.level3.text).not.toContain('<script');
    expect(output.level1.level2.level3.text).toContain('Deep text');
  });

  it('handles empty object', () => {
    const input = {};
    const output = sanitizeSectionContent(input);
    expect(output).toEqual({});
  });

  it('preserves undefined values', () => {
    const input = { key: undefined };
    const output = sanitizeSectionContent(input);
    expect(output.key).toBeUndefined();
  });

  it('handles arrays with mixed types', () => {
    const input = {
      items: [
        '<script>bad</script>text',
        42,
        true,
        null,
        { nested: '<b>ok</b>' },
      ],
    };
    const output = sanitizeSectionContent(input);

    expect(output.items[0]).not.toContain('<script');
    expect(output.items[0]).toContain('text');
    expect(output.items[1]).toBe(42);
    expect(output.items[2]).toBe(true);
    expect(output.items[3]).toBe(null);
    expect((output.items[4] as Record<string, string>).nested).toContain('<b>ok</b>');
  });

  it('handles empty arrays', () => {
    const input = { items: [] };
    const output = sanitizeSectionContent(input);
    expect(output.items).toEqual([]);
  });

  it('handles empty strings in objects', () => {
    const input = { text: '', title: 'Valid' };
    const output = sanitizeSectionContent(input);
    expect(output.text).toBe('');
    expect(output.title).toBe('Valid');
  });
});
