/**
 * README.md Validation Tests
 * 
 * This test suite validates the README.md file for:
 * - Structure and formatting
 * - Link validity
 * - Content completeness
 * - Code block syntax
 * - Image references
 * - Required sections
 * 
 * Testing Framework: Jest (Node.js environment)
 */

const fs = require('fs');
const path = require('path');

describe('README.md Validation', () => {
  let readmeContent;
  let readmeLines;

  beforeAll(() => {
    const readmePath = path.join(__dirname, '..', 'README.md');
    expect(fs.existsSync(readmePath)).toBe(true);
    readmeContent = fs.readFileSync(readmePath, 'utf8');
    readmeLines = readmeContent.split('\n');
  });

  describe('File Structure and Format', () => {
    test('should have proper markdown structure', () => {
      expect(readmeContent).toContain('# TuneSwipe 🎶');
      expect(readmeContent).toContain('## ');
      expect(readmeContent).toContain('---');
    });

    test('should have required main sections', () => {
      const requiredSections = [
        '## Discover Your Next Obsession, One Swipe at a Time',
        '## Features That Rock',
        '## Tech Stack',
        '## How to Get Started',
        '## Contributing',
        '## Reporting Bugs',
        '## Contact'
      ];

      requiredSections.forEach(section => {
        expect(readmeContent).toContain(section);
      });
    });

    test('should have proper heading hierarchy', () => {
      const headings = readmeLines
        .filter(line => line.startsWith('#'))
        .map(line => line.match(/^#+/)[0].length);

      // Should start with h1
      expect(headings[0]).toBe(1);
      
      // Should have multiple heading levels
      expect(Math.max(...headings)).toBeGreaterThan(1);
      expect(Math.min(...headings)).toBe(1);
    });

    test('should have consistent emoji usage in features', () => {
      const emojiPatterns = [
        '🎶', '✅', '🧠', '🎧', '▶️', '🎵', '💾'
      ];
      
      let emojiCount = 0;
      emojiPatterns.forEach(emoji => {
        if (readmeContent.includes(emoji)) {
          emojiCount++;
        }
      });
      
      expect(emojiCount).toBeGreaterThan(3);
    });
  });

  describe('Code Blocks and Syntax', () => {
    test('should have properly formatted code blocks', () => {
      const codeBlockPattern = /```[\s\S]*?```/g;
      const codeBlocks = readmeContent.match(codeBlockPattern) || [];
      
      expect(codeBlocks.length).toBeGreaterThan(5);
      
      // Check that code blocks have proper opening and closing
      codeBlocks.forEach((block, index) => {
        expect(block.startsWith('```')).toBe(true);
        expect(block.endsWith('```')).toBe(true);
      });
    });

    test('should have valid bash commands in setup instructions', () => {
      const bashCommands = [
        'git clone https://github.com/Agrannya-Singh/TuneTrace',
        'npm install',
        'npm run dev',
        'pip install -r requirements.txt',
        'python start.py',
        'docker-compose up --build'
      ];

      bashCommands.forEach(command => {
        expect(readmeContent).toContain(command);
      });
    });

    test('should have proper environment variable examples', () => {
      const envVars = [
        'YOUTUBE_API_KEY=your_super_secret_api_key_here',
        'SPOTIFY_CLIENT_ID=your_spotify_client_id_here',
        'SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here',
        'SPOTIFY_REDIRECT_URI=http://localhost:9002/api/spotify/callback',
        'NEXT_PUBLIC_APP_URL=http://localhost:9002',
        'NEXT_PUBLIC_PYTHON_BACKEND_URL=http://localhost:8000'
      ];

      envVars.forEach(envVar => {
        expect(readmeContent).toContain(envVar);
      });
    });

    test('should have consistent inline code formatting', () => {
      const inlineCodeMatches = readmeContent.match(/`[^`\n]+`/g) || [];
      expect(inlineCodeMatches.length).toBeGreaterThan(10);
      
      // Check for specific inline code examples
      expect(readmeContent).toContain('`.env.local`');
      expect(readmeContent).toContain('`http://localhost:9002`');
      expect(readmeContent).toContain('`http://localhost:8000`');
    });
  });

  describe('Links and References', () => {
    test('should contain all required external documentation links', () => {
      const externalLinks = [
        'https://nextjs.org/',
        'https://www.typescriptlang.org/',
        'https://tailwindcss.com/',
        'https://ui.shadcn.com/',
        'https://nextjs.org/docs/app/building-your-application/routing/route-handlers',
        'https://fastapi.tiangolo.com/',
        'https://developers.google.com/youtube/v3',
        'https://developer.spotify.com/documentation/web-api',
        'https://developer.spotify.com/dashboard'
      ];

      externalLinks.forEach(link => {
        expect(readmeContent).toContain(link);
      });
    });

    test('should have valid internal file references', () => {
      const internalRefs = [
        './SPOTIFY_SETUP.md',
        './DEPLOYMENT.md'
      ];

      internalRefs.forEach(ref => {
        expect(readmeContent).toContain(ref);
      });
    });

    test('should have proper markdown link syntax', () => {
      const markdownLinks = readmeContent.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
      
      expect(markdownLinks.length).toBeGreaterThan(8);
      
      markdownLinks.forEach(link => {
        const linkMatch = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
        expect(linkMatch[1].length).toBeGreaterThan(0); // Link text should exist
        expect(linkMatch[2].length).toBeGreaterThan(0); // Link URL should exist
      });
    });

    test('should have correct repository URL', () => {
      expect(readmeContent).toContain('https://github.com/Agrannya-Singh/TuneTrace');
    });
  });

  describe('Content Quality and Completeness', () => {
    test('should have comprehensive feature descriptions', () => {
      const featureIndicators = [
        'Vibe Check! ✅',
        'AI-Powered Recommendations 🧠',
        'Swipe, Listen, Repeat 🎧',
        'Instant Previews, Powered by YouTube ▶️',
        'Spotify Integration 🎵',
        'Your Personal Mixtape 💾'
      ];

      featureIndicators.forEach(feature => {
        expect(readmeContent).toContain(feature);
      });
    });

    test('should include detailed tech stack information', () => {
      const techStackItems = [
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'ShadCN UI',
        'FastAPI',
        'YouTube Data API',
        'Spotify Web API',
        'SQLite',
        'SQLAlchemy'
      ];

      techStackItems.forEach(tech => {
        expect(readmeContent).toContain(tech);
      });
    });

    test('should have complete setup instructions with proper sections', () => {
      expect(readmeContent).toContain('Local Development');
      expect(readmeContent).toContain('Docker Development');
      expect(readmeContent).toContain('Production Deployment');
      
      // Should include all necessary port numbers
      expect(readmeContent).toContain('9002');
      expect(readmeContent).toContain('8000');
      expect(readmeContent).toContain('3000');
    });

    test('should have contact information', () => {
      expect(readmeContent).toContain('singh.agrannya@gmail.com');
    });

    test('should have detailed contributing guidelines', () => {
      const contributingSteps = [
        'Fork the repository',
        'Create a new branch',
        'Make your changes',
        'Push your branch',
        'Open a pull request'
      ];

      contributingSteps.forEach(step => {
        expect(readmeContent).toContain(step);
      });
    });

    test('should include bug reporting instructions', () => {
      expect(readmeContent).toContain('Reporting Bugs');
      expect(readmeContent).toContain('Search existing issues');
      expect(readmeContent).toContain('open a new issue');
    });
  });

  describe('Image and Media References', () => {
    test('should contain image references', () => {
      const imagePattern = /!\[.*?\]\(.*?\)/g;
      const images = readmeContent.match(imagePattern) || [];
      
      expect(images.length).toBeGreaterThan(2);
    });

    test('should reference GitHub assets correctly', () => {
      const githubAssetPattern = /https:\/\/github\.com\/user-attachments\/assets\/[a-f0-9-]+/g;
      const githubAssets = readmeContent.match(githubAssetPattern) || [];
      expect(githubAssets.length).toBeGreaterThan(1);
    });

    test('should reference GitHub raw content correctly', () => {
      expect(readmeContent).toContain('https://raw.githubusercontent.com/Agrannya-Singh/TuneTrace/refs/heads/Version-2/');
    });

    test('should have proper image dimensions specified', () => {
      expect(readmeContent).toContain('width="1397"');
      expect(readmeContent).toContain('height="897"');
    });
  });

  describe('Markdown Formatting Standards', () => {
    test('should have consistent list formatting', () => {
      const bulletLists = readmeLines.filter(line => line.match(/^\s*[-*+]\s/));
      const numberedLists = readmeLines.filter(line => line.match(/^\s*\d+\.\s/));
      
      expect(bulletLists.length + numberedLists.length).toBeGreaterThan(15);
    });

    test('should have consistent horizontal rule usage', () => {
      const horizontalRules = readmeLines.filter(line => line.trim() === '---');
      expect(horizontalRules.length).toBeGreaterThan(5);
    });

    test('should have proper emphasis and strong text formatting', () => {
      const boldText = readmeContent.match(/\*\*[^*]+\*\*/g) || [];
      expect(boldText.length).toBeGreaterThan(15);
      
      // Check for specific emphasized terms
      expect(readmeContent).toContain('**TuneSwipe**');
      expect(readmeContent).toContain('**SWIPE RIGHT**');
      expect(readmeContent).toContain('**SWIPE LEFT**');
      expect(readmeContent).toContain('**Framework**');
      expect(readmeContent).toContain('**Language**');
    });

    test('should have proper blockquote or note formatting', () => {
      expect(readmeContent).toContain('**Note**:');
    });
  });

  describe('Project-Specific Content Validation', () => {
    test('should mention key project features accurately', () => {
      const keyFeatures = [
        'Tinder-style swiping',
        'AI-powered',
        'collaborative filtering',
        'content-based filtering',
        'hybrid recommendations',
        'real-time learning'
      ];

      keyFeatures.forEach(feature => {
        expect(readmeContent.toLowerCase()).toContain(feature.toLowerCase());
      });
    });

    test('should have correct project naming consistency', () => {
      const tuneSwipeCount = (readmeContent.match(/TuneSwipe/g) || []).length;
      const tuneTraceCount = (readmeContent.match(/TuneTrace/g) || []).length;
      
      expect(tuneSwipeCount).toBeGreaterThan(8);
      expect(tuneTraceCount).toBeGreaterThan(1); // Repository name references
    });

    test('should include all deployment options', () => {
      const deploymentOptions = ['Render', 'Docker', 'Vercel'];
      deploymentOptions.forEach(option => {
        expect(readmeContent).toContain(option);
      });
    });

    test('should specify correct port configurations', () => {
      expect(readmeContent).toContain('localhost:9002');
      expect(readmeContent).toContain('localhost:8000');
      expect(readmeContent).toContain('localhost:3000');
    });

    test('should mention version information', () => {
      expect(readmeContent).toContain('TuneTrace 2.0');
      expect(readmeContent).toContain('Version-2');
    });
  });

  describe('Documentation Completeness and Structure', () => {
    test('should have substantial content length', () => {
      const wordCount = readmeContent.split(/\s+/).length;
      expect(wordCount).toBeGreaterThan(800);
      expect(readmeContent.length).toBeGreaterThan(6000);
    });

    test('should reference all mentioned configuration files', () => {
      const configFiles = [
        '.env.local',
        'requirements.txt',
        'docker-compose.yml',
        'Dockerfile'
      ];

      configFiles.forEach(file => {
        expect(readmeContent).toContain(file);
      });
    });

    test('should include all API configuration sections', () => {
      const apiConfigs = [
        'YouTube API Configuration',
        'Spotify API Configuration',
        'App Configuration'
      ];

      apiConfigs.forEach(config => {
        expect(readmeContent).toContain(config);
      });
    });

    test('should have proper ML/AI terminology', () => {
      const mlTerms = [
        'Machine Learning',
        'ML algorithms',
        'Collaborative Filtering',
        'Content-Based Filtering',
        'Hybrid Recommendations',
        'Real-time Learning'
      ];

      mlTerms.forEach(term => {
        expect(readmeContent).toContain(term);
      });
    });

    test('should include all frontend and backend technologies', () => {
      // Frontend technologies
      expect(readmeContent).toContain('Next.js');
      expect(readmeContent).toContain('React');
      expect(readmeContent).toContain('TypeScript');
      expect(readmeContent).toContain('Tailwind CSS');
      expect(readmeContent).toContain('ShadCN UI');

      // Backend technologies
      expect(readmeContent).toContain('Python FastAPI');
      expect(readmeContent).toContain('SQLite');
      expect(readmeContent).toContain('SQLAlchemy ORM');
    });

    test('should provide clear user journey description', () => {
      const userJourneyElements = [
        'swipe',
        'like',
        'skip',
        'preview',
        'playlist',
        'download',
        'mixtape'
      ];

      userJourneyElements.forEach(element => {
        expect(readmeContent.toLowerCase()).toContain(element.toLowerCase());
      });
    });
  });
});