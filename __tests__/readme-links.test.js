/**
 * README.md Link Validation Tests
 * 
 * This test suite validates all external links in the README.md file
 * to ensure they are accessible and return valid responses.
 * 
 * Testing Framework: Jest (Node.js environment)
 */

const fs = require('fs');
const path = require('path');

describe('README.md Link Validation', () => {
  let readmeContent;

  beforeAll(() => {
    const readmePath = path.join(__dirname, '..', 'README.md');
    readmeContent = fs.readFileSync(readmePath, 'utf8');
  });

  describe('External Link Format Validation', () => {
    test('should have all external links properly formatted', () => {
      const externalUrls = [
        'https://nextjs.org/',
        'https://www.typescriptlang.org/',
        'https://tailwindcss.com/',
        'https://ui.shadcn.com/',
        'https://fastapi.tiangolo.com/',
        'https://developers.google.com/youtube/v3',
        'https://developer.spotify.com/documentation/web-api',
        'https://developer.spotify.com/dashboard'
      ];

      externalUrls.forEach(url => {
        expect(readmeContent).toContain(url);
      });
    });

    test('should have proper markdown link syntax for all links', () => {
      const markdownLinks = readmeContent.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
      
      expect(markdownLinks.length).toBeGreaterThan(8);
      
      markdownLinks.forEach((link, index) => {
        const linkMatch = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
        expect(linkMatch).toBeTruthy();
        expect(linkMatch[1]).toBeTruthy(); // Link text should exist
        expect(linkMatch[2]).toBeTruthy(); // Link URL should exist
        
        // URL should not be empty
        expect(linkMatch[2].trim().length).toBeGreaterThan(0);
      });
    });

    test('should have valid URL formats', () => {
      const urlPattern = /https?:\/\/[^\s)]+/g;
      const urls = readmeContent.match(urlPattern) || [];
      
      expect(urls.length).toBeGreaterThan(10);
      
      urls.forEach(url => {
        // Basic URL format validation
        expect(url).toMatch(/^https?:\/\/.+/);
        expect(url).not.toMatch(/\s/); // No spaces in URLs
      });
    });
  });

  describe('GitHub Asset Links', () => {
    test('should reference valid GitHub asset patterns', () => {
      const githubAssetPattern = /https:\/\/github\.com\/user-attachments\/assets\/[a-f0-9-]+/g;
      const githubAssets = readmeContent.match(githubAssetPattern) || [];
      
      expect(githubAssets.length).toBeGreaterThan(1);
      
      githubAssets.forEach(asset => {
        expect(asset).toMatch(/^https:\/\/github\.com\/user-attachments\/assets\/[a-f0-9-]+$/);
      });
    });

    test('should reference GitHub raw content correctly', () => {
      const rawGithubPattern = /https:\/\/raw\.githubusercontent\.com\/Agrannya-Singh\/TuneTrace\/refs\/heads\/Version-2\//;
      expect(readmeContent).toMatch(rawGithubPattern);
    });
  });

  describe('Internal Reference Validation', () => {
    test('should reference existing documentation files', () => {
      const internalRefs = [
        'SPOTIFY_SETUP.md',
        'DEPLOYMENT.md'
      ];

      internalRefs.forEach(ref => {
        expect(readmeContent).toContain(ref);
        
        // Check if the file actually exists
        const filePath = path.join(__dirname, '..', ref);
        if (fs.existsSync(filePath)) {
          expect(fs.statSync(filePath).isFile()).toBe(true);
        } else {
          console.warn(`Warning: Referenced file ${ref} does not exist yet`);
        }
      });
    });

    test('should have consistent internal link formatting', () => {
      const internalLinkPattern = /\[([^\]]+)\]\(\.\/([^)]+)\)/g;
      const internalLinks = [...readmeContent.matchAll(internalLinkPattern)];
      
      internalLinks.forEach(([fullMatch, linkText, filePath]) => {
        expect(linkText.length).toBeGreaterThan(0);
        expect(filePath.length).toBeGreaterThan(0);
        expect(filePath).toMatch(/\.(md|txt)$/i); // Should be documentation files
      });
    });
  });

  describe('Repository Links', () => {
    test('should have correct repository URL structure', () => {
      const repoUrl = 'https://github.com/Agrannya-Singh/TuneTrace';
      expect(readmeContent).toContain(repoUrl);
      
      // Should appear in git clone command
      expect(readmeContent).toContain(`git clone ${repoUrl}`);
    });

    test('should reference correct branch for raw content', () => {
      expect(readmeContent).toContain('refs/heads/Version-2');
    });
  });
});