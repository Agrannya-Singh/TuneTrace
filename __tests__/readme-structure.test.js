/**
 * README.md Structure and Content Organization Tests
 * 
 * This test suite validates the structural organization and
 * content hierarchy of the README.md file.
 * 
 * Testing Framework: Jest (Node.js environment)
 */

const fs = require('fs');
const path = require('path');

describe('README.md Structure and Organization', () => {
  let readmeContent;
  let readmeLines;

  beforeAll(() => {
    const readmePath = path.join(__dirname, '..', 'README.md');
    readmeContent = fs.readFileSync(readmePath, 'utf8');
    readmeLines = readmeContent.split('\n');
  });

  describe('Document Structure', () => {
    test('should have proper document hierarchy', () => {
      const sections = [];
      readmeLines.forEach((line, index) => {
        if (line.startsWith('# ')) {
          sections.push({ level: 1, title: line, lineNumber: index + 1 });
        } else if (line.startsWith('## ')) {
          sections.push({ level: 2, title: line, lineNumber: index + 1 });
        } else if (line.startsWith('### ')) {
          sections.push({ level: 3, title: line, lineNumber: index + 1 });
        }
      });

      // Should have exactly one H1
      const h1Sections = sections.filter(s => s.level === 1);
      expect(h1Sections).toHaveLength(1);
      expect(h1Sections[0].title).toContain('TuneSwipe 🎶');

      // Should have multiple H2 sections
      const h2Sections = sections.filter(s => s.level === 2);
      expect(h2Sections.length).toBeGreaterThan(5);

      // Should have proper section ordering
      expect(sections[0].level).toBe(1); // First should be H1
    });

    test('should have logical section flow', () => {
      const expectedSectionOrder = [
        'TuneSwipe 🎶',
        'Discover Your Next Obsession',
        'Features That Rock',
        'Tech Stack',
        'How to Get Started',
        'Contributing',
        'Contact'
      ];

      expectedSectionOrder.forEach(sectionTitle => {
        expect(readmeContent).toContain(sectionTitle);
      });
    });

    test('should have proper section separation', () => {
      const horizontalRules = readmeLines
        .map((line, index) => ({ line: line.trim(), index }))
        .filter(item => item.line === '---');

      expect(horizontalRules.length).toBeGreaterThan(5);
      
      // Should have consistent spacing around horizontal rules
      horizontalRules.forEach(rule => {
        if (rule.index > 0) {
          const previousLine = readmeLines[rule.index - 1].trim();
          const nextLine = readmeLines[rule.index + 1]?.trim() || '';
          
          // Previous or next line should be empty for proper spacing
          expect(previousLine === '' || nextLine === '').toBe(true);
        }
      });
    });
  });

  describe('Content Organization', () => {
    test('should have balanced content distribution', () => {
      const sections = readmeContent.split(/##\s+/).slice(1); // Remove content before first ##
      
      // Each major section should have substantial content
      const substantialSections = sections.filter(section => {
        const wordCount = section.split(/\s+/).length;
        return wordCount > 30;
      });

      expect(substantialSections.length).toBeGreaterThan(4);
    });

    test('should have proper feature list structure', () => {
      const featuresSection = readmeContent.match(/## Features That Rock([\s\S]*?)##/);
      expect(featuresSection).toBeTruthy();
      
      const featuresContent = featuresSection[1];
      
      // Should have multiple feature items with emojis
      const featureItems = featuresContent.match(/- \*\*[^*]+\*\* [^-]+/g) || [];
      expect(featureItems.length).toBeGreaterThan(4);
      
      // Each feature should have description
      featureItems.forEach(item => {
        expect(item.length).toBeGreaterThan(20);
      });
    });

    test('should have comprehensive tech stack organization', () => {
      const techStackSection = readmeContent.match(/## Tech Stack([\s\S]*?)##/);
      expect(techStackSection).toBeTruthy();
      
      const techContent = techStackSection[1];
      
      // Should have Frontend and Backend subsections
      expect(techContent).toContain('### Frontend');
      expect(techContent).toContain('### Backend');
      
      // Should list specific technologies
      const techList = techContent.match(/- \*\*[^*]+\*\*:/g) || [];
      expect(techList.length).toBeGreaterThan(8);
    });

    test('should have detailed setup instructions', () => {
      const setupSection = readmeContent.match(/## How to Get Started([\s\S]*?)##/);
      expect(setupSection).toBeTruthy();
      
      const setupContent = setupSection[1];
      
      // Should have multiple deployment options
      expect(setupContent).toContain('### Local Development');
      expect(setupContent).toContain('### Docker Development');
      expect(setupContent).toContain('### Production Deployment');
      
      // Should have numbered steps
      const numberedSteps = setupContent.match(/^\d+\.\s+/gm) || [];
      expect(numberedSteps.length).toBeGreaterThan(3);
    });
  });

  describe('Code Block Organization', () => {
    test('should have well-structured code examples', () => {
      const codeBlocks = readmeContent.match(/```[\s\S]*?```/g) || [];
      
      expect(codeBlocks.length).toBeGreaterThan(5);
      
      // Should have different types of code blocks
      const bashBlocks = codeBlocks.filter(block => block.includes('bash') || block.includes('git clone') || block.includes('npm'));
      const envBlocks = codeBlocks.filter(block => block.includes('YOUTUBE_API_KEY') || block.includes('SPOTIFY_CLIENT_ID'));
      
      expect(bashBlocks.length).toBeGreaterThan(2);
      expect(envBlocks.length).toBeGreaterThan(0);
    });

    test('should have consistent code block formatting', () => {
      const codeBlocks = readmeContent.match(/```[\s\S]*?```/g) || [];
      
      codeBlocks.forEach((block, index) => {
        // Should not have empty code blocks
        const codeContent = block.replace(/```[a-z]*\n?/, '').replace(/\n?```$/, '');
        expect(codeContent.trim().length).toBeGreaterThan(0);
        
        // Should have proper line endings
        expect(block.endsWith('```')).toBe(true);
      });
    });
  });

  describe('Visual Elements Organization', () => {
    test('should have properly placed images', () => {
      const images = readmeContent.match(/!\[.*?\]\([^)]+\)/g) || [];
      expect(images.length).toBeGreaterThan(2);
      
      // Images should have context around them
      images.forEach(image => {
        const imageIndex = readmeContent.indexOf(image);
        const beforeImage = readmeContent.substring(Math.max(0, imageIndex - 100), imageIndex);
        const afterImage = readmeContent.substring(imageIndex + image.length, imageIndex + image.length + 100);
        
        // Should have some descriptive text near images
        expect(beforeImage.length + afterImage.length).toBeGreaterThan(0);
      });
    });

    test('should have consistent emoji usage across sections', () => {
      const emojiSections = [
        { section: 'Features That Rock', emojis: ['✅', '🧠', '🎧', '▶️', '🎵', '💾'] }
      ];
      
      emojiSections.forEach(({ section, emojis }) => {
        const sectionMatch = readmeContent.match(new RegExp(`## ${section}([\\s\\S]*?)##`));
        if (sectionMatch) {
          const sectionContent = sectionMatch[1];
          const foundEmojis = emojis.filter(emoji => sectionContent.includes(emoji));
          expect(foundEmojis.length).toBeGreaterThan(emojis.length * 0.5);
        }
      });
    });
  });

  describe('Professional Documentation Standards', () => {
    test('should have comprehensive contact and support information', () => {
      // Should have contact section
      expect(readmeContent).toContain('## Contact');
      expect(readmeContent).toContain('singh.agrannya@gmail.com');
      
      // Should have contributing guidelines
      expect(readmeContent).toContain('## Contributing');
      expect(readmeContent).toContain('## Reporting Bugs');
    });

    test('should have proper project metadata', () => {
      // Should mention the project showcase aspect
      expect(readmeContent).toContain('showcases my ability');
      expect(readmeContent).toContain('full-stack application');
      expect(readmeContent).toContain('external APIs');
      expect(readmeContent).toContain('personalized user experience');
    });

    test('should have clear value proposition', () => {
      // Should explain the problem and solution
      expect(readmeContent).toContain('Tired of the same old playlists');
      expect(readmeContent).toContain('discover new music');
      expect(readmeContent).toContain('fresh, interactive way');
      expect(readmeContent).toContain('Tinder-style swiping interface');
    });
  });
});