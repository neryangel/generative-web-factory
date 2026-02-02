import { describe, it, expect } from 'vitest';
import { escapeHtml } from './escapeHtml';

describe('escapeHtml', () => {
  it('escapes ampersand (&)', () => {
    const input = 'Tom & Jerry';
    const output = escapeHtml(input);
    expect(output).toBe('Tom &amp; Jerry');
  });

  it('escapes less-than (<)', () => {
    const input = '5 < 10';
    const output = escapeHtml(input);
    expect(output).toBe('5 &lt; 10');
  });

  it('escapes greater-than (>)', () => {
    const input = '10 > 5';
    const output = escapeHtml(input);
    expect(output).toBe('10 &gt; 5');
  });

  it('escapes double quotes (")', () => {
    const input = 'He said "hello"';
    const output = escapeHtml(input);
    expect(output).toBe('He said &quot;hello&quot;');
  });

  it('escapes single quotes (\')', () => {
    const input = "It's working";
    const output = escapeHtml(input);
    expect(output).toBe('It&#39;s working');
  });

  it('escapes all special characters together', () => {
    const input = '<script>alert("XSS & more")</script>';
    const output = escapeHtml(input);
    expect(output).toBe('&lt;script&gt;alert(&quot;XSS &amp; more&quot;)&lt;/script&gt;');
    expect(output).not.toContain('<');
    expect(output).not.toContain('>');
    expect(output).not.toContain('"');
  });

  it('handles empty string', () => {
    const input = '';
    const output = escapeHtml(input);
    expect(output).toBe('');
  });

  it('handles string with no special characters', () => {
    const input = 'Hello World 123';
    const output = escapeHtml(input);
    expect(output).toBe('Hello World 123');
  });

  it('escapes HTML tag completely', () => {
    const input = '<div class="test">content</div>';
    const output = escapeHtml(input);
    expect(output).toBe('&lt;div class=&quot;test&quot;&gt;content&lt;/div&gt;');
    expect(output).not.toContain('<div');
    expect(output).not.toContain('</div>');
  });

  it('escapes event handler attributes', () => {
    const input = 'onerror="alert(1)"';
    const output = escapeHtml(input);
    expect(output).toBe('onerror=&quot;alert(1)&quot;');
    expect(output).not.toContain('"');
  });

  it('is idempotent (double-escaping changes output)', () => {
    const input = '<script>alert("test")</script>';
    const firstEscape = escapeHtml(input);
    const secondEscape = escapeHtml(firstEscape);

    // First escape converts < to &lt;
    expect(firstEscape).toBe('&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;');

    // Second escape converts & to &amp;, so &lt; becomes &amp;lt;
    expect(secondEscape).toBe('&amp;lt;script&amp;gt;alert(&amp;quot;test&amp;quot;)&amp;lt;/script&amp;gt;');

    // They should be different
    expect(firstEscape).not.toBe(secondEscape);
  });

  it('prevents XSS injection in HTML context', () => {
    const userInput = '"><script>alert(1)</script><div class="';
    const output = escapeHtml(userInput);

    expect(output).toBe('&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;&lt;div class=&quot;');
    expect(output).not.toContain('<script');
    expect(output).not.toContain('</script>');
  });

  it('prevents XSS in attribute context', () => {
    const userInput = '" onload="alert(1)';
    const output = escapeHtml(userInput);

    expect(output).toBe('&quot; onload=&quot;alert(1)');
    expect(output).not.toContain('" onload="');
  });

  it('handles multiple ampersands correctly', () => {
    const input = 'A & B & C';
    const output = escapeHtml(input);
    expect(output).toBe('A &amp; B &amp; C');
  });

  it('handles mixed special characters in order', () => {
    const input = '&<>"\'';
    const output = escapeHtml(input);
    expect(output).toBe('&amp;&lt;&gt;&quot;&#39;');
  });
});
