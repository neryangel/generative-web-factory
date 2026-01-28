-- ═══════════════════════════════════════════════════════════════
-- Migration: Add diverse website templates with variant support
-- Each template uses different section variants for visual diversity
-- ═══════════════════════════════════════════════════════════════

-- Template 1: SaaS Modern - Tech/startup dark theme with centered hero
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('saas-modern', 'SaaS מודרני', 'saas', 'תבנית מודרנית למוצר SaaS עם דף נחיתה מרשים, תמחור ו-FAQ',
'{
  "meta": {
    "name": "SaaS מודרני",
    "template_id": "saas-modern",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#6366F1",
      "secondary": "#1E1B4B",
      "accent": "#06B6D4"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "default", "content": { "headline": "הפלטפורמה שתשנה את העסק שלכם", "subheadline": "ניהול חכם, אוטומציה מתקדמת, ותובנות בזמן אמת. הכל במקום אחד.", "cta_text": "התחילו בחינם", "secondary_cta_text": "צפו בדמו", "badge_text": "חדש! גרסה 3.0 כאן" } },
        { "type": "features", "variant": "default", "content": { "title": "למה לבחור בנו?", "subtitle": "כל הכלים שאתם צריכים לנהל עסק מצליח", "items": [{ "icon": "Zap", "title": "מהירות בזק", "description": "ביצועים מהירים פי 10 מהמתחרים" }, { "icon": "Shield", "title": "אבטחה מתקדמת", "description": "הצפנה מקצה לקצה והגנה על המידע שלכם" }, { "icon": "BarChart3", "title": "אנליטיקס חכם", "description": "תובנות מבוססות AI שעוזרות לקבל החלטות" }, { "icon": "Users", "title": "עבודת צוות", "description": "שיתוף פעולה חלק בין כל חברי הצוות" }, { "icon": "Globe", "title": "גלובלי", "description": "תמיכה ב-40+ שפות ומטבעות" }, { "icon": "HeadphonesIcon", "title": "תמיכה 24/7", "description": "צוות מומחים זמין לכם בכל שעה" }] } },
        { "type": "stats", "variant": "default", "content": { "title": "המספרים מדברים", "subtitle": "תוצאות מוכחות מלקוחות אמיתיים", "stats": [{ "value": 50000, "suffix": "+", "label": "משתמשים פעילים", "icon": "Users" }, { "value": 99, "suffix": "%", "label": "שביעות רצון", "icon": "Award" }, { "value": 150, "suffix": "+", "label": "אינטגרציות", "icon": "Globe" }, { "value": 24, "suffix": "/7", "label": "תמיכה זמינה", "icon": "TrendingUp" }] } },
        { "type": "testimonials", "variant": "default", "content": { "title": "מה הלקוחות אומרים", "subtitle": "אלפי עסקים כבר סומכים עלינו" } },
        { "type": "pricing", "variant": "default", "content": { "title": "תכניות מחירים", "subtitle": "בחרו את התכנית שמתאימה לכם" } },
        { "type": "faq", "variant": "default", "content": { "title": "שאלות נפוצות", "subtitle": "תשובות לשאלות הנפוצות ביותר" } },
        { "type": "cta", "variant": "default", "content": { "headline": "מוכנים להתחיל?", "description": "הצטרפו לאלפי עסקים שכבר משתמשים בפלטפורמה שלנו", "button_text": "התחילו בחינם עכשיו" } },
        { "type": "footer", "variant": "default" }
      ]
    }
  ]
}', true);

-- Template 2: Portfolio Minimal - Clean, typography-focused
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('portfolio-minimal', 'פורטפוליו מינימלי', 'portfolio', 'תבנית נקייה ומינימלית לאנשי קריאייטיב, מעצבים וצלמים',
'{
  "meta": {
    "name": "פורטפוליו מינימלי",
    "template_id": "portfolio-minimal",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#18181B",
      "secondary": "#27272A",
      "accent": "#A1A1AA"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "minimal", "content": { "headline": "עיצוב שמספר סיפור", "subheadline": "מעצב/ת חוויות דיגיטליות. יוצר/ת מותגים שנזכרים.", "cta_text": "צפו בעבודות" } },
        { "type": "gallery", "variant": "masonry", "content": { "title": "עבודות נבחרות", "subtitle": "פרויקטים שעיצבתי עבור מותגים מובילים" } },
        { "type": "about", "variant": "team", "content": { "title": "קצת עליי", "content": "מעצב/ת עם למעלה מ-10 שנות ניסיון בעיצוב דיגיטלי, מיתוג וחוויית משתמש. עובד/ת עם מותגים מהארץ ומהעולם.", "features": ["עיצוב UI/UX", "מיתוג ושפה חזותית", "עיצוב אתרים ואפליקציות", "הדרכות עיצוב"] } },
        { "type": "testimonials", "variant": "single", "content": { "title": "המלצות", "subtitle": "" } },
        { "type": "contact", "variant": "minimal", "content": { "title": "בואו נדבר", "subtitle": "מוזמנים לפנות לשיתוף פעולה, פרויקט חדש, או סתם לשיחה", "email": "hello@studio.co.il", "phone": "050-1234567" } },
        { "type": "footer", "variant": "minimal" }
      ]
    }
  ]
}', true);

-- Template 3: Business Professional - Split hero, corporate feel
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('business-pro', 'עסקי מקצועי', 'business', 'תבנית מקצועית לעסקים עם צוות, שירותים ודף יצירת קשר',
'{
  "meta": {
    "name": "עסקי מקצועי",
    "template_id": "business-pro",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#0F766E",
      "secondary": "#134E4A",
      "accent": "#2DD4BF"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "split", "content": { "headline": "פתרונות עסקיים שעובדים", "subheadline": "אנחנו עוזרים לעסקים לצמוח עם שירותי ייעוץ, אסטרטגיה וטכנולוגיה מתקדמת.", "cta_text": "קבעו פגישת ייעוץ", "secondary_cta_text": "גלו את השירותים", "badge_text": "מובילים בתחום מאז 2010" } },
        { "type": "features", "variant": "cards", "content": { "title": "השירותים שלנו", "subtitle": "פתרונות מותאמים אישית לכל עסק", "items": [{ "icon": "BarChart3", "title": "ייעוץ אסטרטגי", "description": "בניית תכנית עסקית מותאמת למטרות שלכם" }, { "icon": "Users", "title": "ניהול פרויקטים", "description": "ליווי מקצועי מהרעיון ועד לביצוע" }, { "icon": "TrendingUp", "title": "שיווק דיגיטלי", "description": "קמפיינים ממוקדים שמביאים תוצאות" }, { "icon": "Code", "title": "פיתוח טכנולוגי", "description": "פתרונות טכנולוגיים חדשניים" }] } },
        { "type": "stats", "variant": "inline", "content": { "stats": [{ "value": 500, "suffix": "+", "label": "פרויקטים שהושלמו", "icon": "Award" }, { "value": 200, "suffix": "+", "label": "לקוחות מרוצים", "icon": "Users" }, { "value": 15, "suffix": "+", "label": "שנות ניסיון", "icon": "TrendingUp" }, { "value": 98, "suffix": "%", "label": "שביעות רצון", "icon": "Star" }] } },
        { "type": "about", "variant": "default", "content": { "title": "הסיפור שלנו", "content": "הוקמנו מתוך אמונה שכל עסק ראוי לייעוץ מקצועי ברמה הגבוהה ביותר. עם צוות מומחים ושנים של ניסיון, אנחנו כאן כדי לקחת את העסק שלכם לשלב הבא." } },
        { "type": "testimonials", "variant": "grid", "content": { "title": "לקוחות ממליצים", "subtitle": "שמענו מה הלקוחות שלנו חושבים" } },
        { "type": "cta", "variant": "floating", "content": { "headline": "מוכנים לקחת את העסק לשלב הבא?", "description": "צוות המומחים שלנו מחכה לשמוע מכם", "button_text": "קבעו פגישה חינם" } },
        { "type": "footer", "variant": "default" }
      ]
    },
    {
      "slug": "team",
      "title": "הצוות",
      "sections": [
        { "type": "hero", "variant": "minimal", "content": { "headline": "הצוות שלנו", "subheadline": "אנשים מוכשרים שמאמינים בשינוי", "cta_text": "הצטרפו אלינו" } },
        { "type": "team", "variant": "default" },
        { "type": "footer", "variant": "default" }
      ]
    },
    {
      "slug": "contact",
      "title": "צור קשר",
      "sections": [
        { "type": "contact", "variant": "split", "content": { "title": "דברו איתנו", "subtitle": "נשמח לשמוע מכם ולעזור בכל שאלה", "email": "info@business.co.il", "phone": "03-1234567", "address": "רחוב הרצל 1, תל אביב" } },
        { "type": "footer", "variant": "default" }
      ]
    }
  ]
}', true);

-- Template 4: Restaurant Premium - Warm, immersive, gradient hero
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('restaurant-premium', 'מסעדה פרימיום', 'restaurant', 'תבנית יוקרתית למסעדות עם אווירה חמה, גלריה מרשימה וטפסי הזמנה',
'{
  "meta": {
    "name": "מסעדה פרימיום",
    "template_id": "restaurant-premium",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#B45309",
      "secondary": "#451A03",
      "accent": "#F59E0B"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "video", "content": { "headline": "טעמים שמספרים סיפור", "subheadline": "חוויה קולינרית שמשלבת מסורת עם חדשנות. כל מנה נוצרת באהבה ובמקצועיות.", "cta_text": "הזמינו שולחן", "secondary_cta_text": "לתפריט" } },
        { "type": "about", "variant": "default", "content": { "title": "הסיפור שלנו", "content": "כבר למעלה מ-20 שנה אנחנו מגישים מנות שנוצרות מחומרי גלם טריים ומקומיים. השף הראשי שלנו מביא השראה ממטבחי העולם ומשלב אותה עם המסורת הישראלית.", "features": ["חומרי גלם מקומיים", "שף בינלאומי מוביל", "חדר יין פרטי", "אירועים מיוחדים"] } },
        { "type": "gallery", "variant": "masonry", "content": { "title": "מהמטבח שלנו", "subtitle": "רגעים של טעם ויופי" } },
        { "type": "features", "variant": "list", "content": { "title": "למה אצלנו?", "subtitle": "", "items": [{ "icon": "Star", "title": "חומרי גלם מובחרים", "description": "עובדים רק עם ספקים מקומיים ואיכותיים" }, { "icon": "Award", "title": "שף מעטר פרסים", "description": "השף שלנו זכה ב-3 כוכבי מישלן" }, { "icon": "Heart", "title": "אווירה ייחודית", "description": "עיצוב פנים שמשלב חום ביתי עם אלגנטיות" }] } },
        { "type": "testimonials", "variant": "cards", "content": { "title": "מה אומרים עלינו", "subtitle": "" } },
        { "type": "cta", "variant": "banner", "content": { "headline": "הזמינו שולחן עוד היום", "button_text": "להזמנה" } },
        { "type": "footer", "variant": "simple" }
      ]
    },
    {
      "slug": "menu",
      "title": "תפריט",
      "sections": [
        { "type": "hero", "variant": "minimal", "content": { "headline": "התפריט שלנו", "subheadline": "מנות שנוצרו באהבה" } },
        { "type": "features", "variant": "cards", "content": { "title": "מנות פופולריות", "subtitle": "הטעמים האהובים ביותר", "items": [{ "icon": "UtensilsCrossed", "title": "פילה בקר", "description": "פילה מושלם עם רוטב יין אדום, פירה כמהין ואספרגוס" }, { "icon": "UtensilsCrossed", "title": "ריזוטו פטריות", "description": "ריזוטו קרמי עם פטריות יער, פרמז׳ן ושמן כמהין" }, { "icon": "UtensilsCrossed", "title": "דג ים", "description": "פילה דניס טרי עם ירקות עונתיים ורוטב לימון" }] } },
        { "type": "footer", "variant": "simple" }
      ]
    },
    {
      "slug": "contact",
      "title": "צור קשר",
      "sections": [
        { "type": "contact", "variant": "full", "content": { "title": "בואו לבקר אותנו", "subtitle": "או שמרו שולחן לערב מושלם", "email": "info@restaurant.co.il", "phone": "03-9876543", "address": "שדרות רוטשילד 45, תל אביב", "hours": "א-ה 12:00-23:00, ו-ש 18:00-00:00" } },
        { "type": "footer", "variant": "simple" }
      ]
    }
  ]
}', true);

-- Template 5: Clinic / Medical - Soft, trustworthy, split hero
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('clinic-care', 'קליניקה מקצועית', 'clinic', 'תבנית רכה ומקצועית לקליניקות, רופאים ומטפלים',
'{
  "meta": {
    "name": "קליניקה מקצועית",
    "template_id": "clinic-care",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#0EA5E9",
      "secondary": "#0C4A6E",
      "accent": "#38BDF8"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "split", "content": { "headline": "הבריאות שלכם בידיים טובות", "subheadline": "צוות רפואי מקצועי, טכנולוגיה מתקדמת, וגישה אישית לכל מטופל. הקליניקה שלנו מציעה טיפול ברמה הגבוהה ביותר.", "cta_text": "קבעו תור", "secondary_cta_text": "התחומים שלנו", "badge_text": "קליניקה מובילה בישראל" } },
        { "type": "features", "variant": "cards", "content": { "title": "התחומים שלנו", "subtitle": "מגוון רחב של שירותים רפואיים", "items": [{ "icon": "Heart", "title": "רפואה פנימית", "description": "אבחון וטיפול מקיף במחלות פנימיות" }, { "icon": "Eye", "title": "רפואת עיניים", "description": "בדיקות עיניים מתקדמות וטיפולי לייזר" }, { "icon": "Bone", "title": "אורתופדיה", "description": "טיפול בבעיות שלד ומפרקים" }, { "icon": "Brain", "title": "נוירולוגיה", "description": "אבחון וטיפול במערכת העצבים" }] } },
        { "type": "team", "variant": "default", "content": { "title": "הצוות הרפואי", "subtitle": "מומחים מובילים בתחומם" } },
        { "type": "testimonials", "variant": "grid", "content": { "title": "מטופלים ממליצים", "subtitle": "חוות דעת ממטופלים מרוצים" } },
        { "type": "faq", "variant": "minimal", "content": { "title": "שאלות נפוצות", "subtitle": "תשובות לשאלות שנשאלות הרבה", "items": [{ "question": "האם אתם עובדים עם קופות חולים?", "answer": "כן, אנחנו עובדים עם כל קופות החולים ומרבית חברות הביטוח.", "category": "כללי" }, { "question": "כמה זמן ממתינים לתור?", "answer": "זמני ההמתנה משתנים לפי המחלקה. תורים דחופים ניתנים בו ביום.", "category": "תורים" }, { "question": "האם יש חניה?", "answer": "כן, חניון תת-קרקעי פעיל לרשות המטופלים.", "category": "כללי" }] } },
        { "type": "cta", "variant": "floating", "content": { "headline": "מוכנים לקבוע תור?", "description": "הצוות שלנו מחכה לכם", "button_text": "קבעו תור עכשיו" } },
        { "type": "footer", "variant": "default" }
      ]
    },
    {
      "slug": "contact",
      "title": "צור קשר",
      "sections": [
        { "type": "contact", "variant": "split", "content": { "title": "צרו קשר", "subtitle": "נשמח לעזור לכם", "email": "info@clinic.co.il", "phone": "03-5551234", "address": "רחוב ויצמן 10, תל אביב", "hours": "א-ה 08:00-20:00, ו 08:00-13:00" } },
        { "type": "footer", "variant": "default" }
      ]
    }
  ]
}', true);

-- Template 6: Landing Page - High conversion, gradient hero
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('landing-conversion', 'דף נחיתה ממיר', 'landing', 'דף נחיתה עם hero מרשים, הוכחות חברתיות וטופס ליד',
'{
  "meta": {
    "name": "דף נחיתה ממיר",
    "template_id": "landing-conversion",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#7C3AED",
      "secondary": "#1E1B4B",
      "accent": "#F472B6"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף נחיתה",
      "sections": [
        { "type": "hero", "variant": "video", "content": { "headline": "הגיע הזמן לשינוי אמיתי", "subheadline": "הצטרפו לאלפי אנשים שכבר שינו את חייהם. תכנית מוכחת שנותנת תוצאות.", "cta_text": "הצטרפו עכשיו", "secondary_cta_text": "גלו איך" } },
        { "type": "stats", "variant": "inline", "content": { "stats": [{ "value": 10000, "suffix": "+", "label": "מצטרפים", "icon": "Users" }, { "value": 97, "suffix": "%", "label": "הצלחה", "icon": "Award" }, { "value": 30, "suffix": " יום", "label": "לתוצאות", "icon": "TrendingUp" }] } },
        { "type": "features", "variant": "default", "content": { "title": "איך זה עובד?", "subtitle": "3 שלבים פשוטים לתוצאות מדהימות", "items": [{ "icon": "UserPlus", "title": "שלב 1: הרשמה", "description": "נרשמים בקלות תוך דקה אחת" }, { "icon": "Settings", "title": "שלב 2: התאמה אישית", "description": "מקבלים תכנית מותאמת אישית" }, { "icon": "Rocket", "title": "שלב 3: תוצאות", "description": "רואים תוצאות כבר אחרי שבוע" }] } },
        { "type": "testimonials", "variant": "default", "content": { "title": "סיפורי הצלחה", "subtitle": "שמעו מאנשים אמיתיים" } },
        { "type": "pricing", "variant": "simple", "content": { "title": "בחרו את המסלול", "subtitle": "30 יום אחריות החזר כספי מלא" } },
        { "type": "faq", "variant": "grid", "content": { "title": "שאלות ותשובות", "subtitle": "" } },
        { "type": "cta", "variant": "default", "content": { "headline": "אל תפספסו את ההזדמנות", "description": "ההצעה מוגבלת! הצטרפו עכשיו וקבלו 50% הנחה", "button_text": "אני רוצה להצטרף" } },
        { "type": "footer", "variant": "minimal" }
      ]
    }
  ]
}', true);

-- Template 7: Real Estate - Luxury, full-bleed, gallery-focused
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('realestate-luxury', 'נדל"ן יוקרתי', 'realestate', 'תבנית יוקרתית לנדל"ן עם גלריה מרשימה ופרטי נכסים',
'{
  "meta": {
    "name": "נדלן יוקרתי",
    "template_id": "realestate-luxury",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#B8860B",
      "secondary": "#1C1917",
      "accent": "#D4A853"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "video", "content": { "headline": "הבית שחלמתם עליו", "subheadline": "נכסי יוקרה במיקומים הטובים ביותר. שירות אישי, מקצועיות ודיסקרטיות.", "cta_text": "לנכסים שלנו", "secondary_cta_text": "צרו קשר" } },
        { "type": "features", "variant": "minimal", "content": { "title": "למה אנחנו?", "subtitle": "", "items": [{ "icon": "Home", "title": "נכסי פרימיום", "description": "רק נכסים ברמה הגבוהה ביותר" }, { "icon": "Shield", "title": "דיסקרטיות מלאה", "description": "כל עסקה מתנהלת בדיסקרטיות מוחלטת" }, { "icon": "Users", "title": "שירות אישי", "description": "סוכן מקצועי צמוד לכל לקוח" }, { "icon": "Globe", "title": "חשיפה בינלאומית", "description": "גישה לקונים מכל העולם" }] } },
        { "type": "gallery", "variant": "carousel", "content": { "title": "נכסים נבחרים", "subtitle": "הצצה לנכסי היוקרה שלנו" } },
        { "type": "stats", "variant": "minimal", "content": { "stats": [{ "value": 2, "suffix": "B+", "label": "שווי נכסים שנמכרו", "icon": "TrendingUp" }, { "value": 350, "suffix": "+", "label": "נכסים שנמכרו", "icon": "Home" }, { "value": 25, "suffix": "+", "label": "שנות ניסיון", "icon": "Award" }, { "value": 100, "suffix": "%", "label": "שביעות רצון", "icon": "Star" }] } },
        { "type": "testimonials", "variant": "single", "content": { "title": "לקוחות מספרים", "subtitle": "" } },
        { "type": "cta", "variant": "split", "content": { "headline": "מחפשים נכס יוקרתי?", "description": "צוות המומחים שלנו ילווה אתכם בכל שלב. שיחת ייעוץ ראשונה ללא עלות.", "button_text": "דברו איתנו" } },
        { "type": "footer", "variant": "simple" }
      ]
    },
    {
      "slug": "contact",
      "title": "צור קשר",
      "sections": [
        { "type": "contact", "variant": "minimal", "content": { "title": "נשמח לשמוע מכם", "subtitle": "השאירו פרטים ונחזור אליכם בהקדם", "email": "luxury@realestate.co.il", "phone": "054-9876543", "address": "מגדל אלקטרה, דרך מנחם בגין 154, תל אביב" } },
        { "type": "footer", "variant": "simple" }
      ]
    }
  ]
}', true);

-- Template 8: Event / Wedding - Vibrant, dynamic, carousel gallery
INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('event-vibrant', 'אירועים ואירגון', 'event', 'תבנית דינמית לחברות הפקה, אירועים וחתונות',
'{
  "meta": {
    "name": "אירועים ואירגון",
    "template_id": "event-vibrant",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#E11D48",
      "secondary": "#4C0519",
      "accent": "#FB7185"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    },
    "direction": "rtl"
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": [
        { "type": "hero", "variant": "video", "content": { "headline": "רגעים שלא ישכחו", "subheadline": "מהפקות אינטימיות ועד אירועים של אלפים. כל אירוע מקבל את היחס המלא.", "cta_text": "דברו איתנו", "secondary_cta_text": "צפו בגלריה" } },
        { "type": "gallery", "variant": "masonry", "content": { "title": "מהאירועים שלנו", "subtitle": "רגעים שאנחנו גאים בהם" } },
        { "type": "features", "variant": "list", "content": { "title": "השירותים שלנו", "subtitle": "", "items": [{ "icon": "PartyPopper", "title": "הפקת אירועים", "description": "תכנון והפקה מלאה מא' עד ת'" }, { "icon": "Camera", "title": "צילום ווידאו", "description": "תיעוד מקצועי שישמור את הרגעים" }, { "icon": "Music", "title": "DJ ומוזיקה", "description": "אווירה מושלמת עם המוזיקה הנכונה" }, { "icon": "Flower2", "title": "עיצוב ופרחים", "description": "עיצוב מרהיב שמשלים את האווירה" }] } },
        { "type": "testimonials", "variant": "cards", "content": { "title": "זוגות מספרים", "subtitle": "חוויות מאירועים שהפקנו" } },
        { "type": "stats", "variant": "default", "content": { "title": "במספרים", "subtitle": "", "stats": [{ "value": 1200, "suffix": "+", "label": "אירועים שהפקנו", "icon": "Star" }, { "value": 50000, "suffix": "+", "label": "אורחים מרוצים", "icon": "Users" }, { "value": 8, "suffix": "+", "label": "שנות ניסיון", "icon": "Award" }] } },
        { "type": "cta", "variant": "default", "content": { "headline": "מתכננים אירוע?", "description": "צרו קשר ונבנה יחד את האירוע המושלם", "button_text": "קבלו הצעת מחיר" } },
        { "type": "footer", "variant": "default" }
      ]
    },
    {
      "slug": "contact",
      "title": "צור קשר",
      "sections": [
        { "type": "contact", "variant": "full", "content": { "title": "בואו ניצור משהו מיוחד", "subtitle": "ספרו לנו על האירוע שלכם", "email": "events@studio.co.il", "phone": "054-1234567", "address": "שדרות ירושלים 25, תל אביב" } },
        { "type": "footer", "variant": "default" }
      ]
    }
  ]
}', true);
