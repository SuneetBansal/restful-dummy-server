// lib imports
const fs = require('fs');
const path = require('path');

function getMatchingDummyData(req, configPath) {
    let fileList;

    try {
        fileList = fs.readdirSync(configPath);
    } catch (exception) {
        console.log('There is no file found at ' + configPath);    
    }

    // checking if fileList is not empty
    if (fileList?.length > 0) {
        let result;

        for (let index = 0; index < fileList?.length > 0; index ++) {
            const file = fileList[index];
            const filePath = path.join(configPath, file);
            const fileStat = fs.statSync(filePath);

            if (fileStat.isFile()) {
                result = getItem(req, filePath);
            } else if (fileStat.isDirectory()) {
                getMatchingDummyData(req, filePath);
            }

            if (result) {
                return result;
            }
        }
    }
}

/**
 * To get matching mock data
 * 
 * @param req, filePath
 */
function getItem(req, filePath) {
    const fileContent = fs.readFileSync(filePath);
    let mockData = [];

    if (/.json$/.test(filePath)) {
        mockData = JSON.parse(fileContent) ?? [];
    }

    if (!Array.isArray(mockData)) {
        mockData = [mockData];
    }

   return mockData?.find((item) => (isMatchingPathExists(req, item)));
}

// Below cases supporting - 
// 1. url: /test/:input will match with /test/abc or /test/xyz etc.
// 2. url: /test/*.* will match with /test/abc.jpg or /test/xyz.png etc.
// 3. url: /test/**/*.jpg will match with /test/abc.jpg or /test/xyz/abc.jpg or /test/test2/xyg.jpg etc.
// 4. url: /test/**/*.* will match with /test/test2/xyz.jpg or /test/test2/test3/xyz.png etc.
function buildMockPathRegex(mockPath) {
  if (!mockPath || typeof mockPath !== 'string') {
    throw new Error('mockPath must be a non-empty string');
  }

  // 1) Escape literal '.' and '/'
  let pattern = mockPath
    .replace(/\//g, '\\/')
    .replace(/\./g, '\\.');

  // 2) Handle double-star first (deep wildcard)
  //    - matches across '/' as well
  pattern = pattern.replace(/\*\*(?!\*)/g, '[\\w./-]+');

  // 3) Handle single star (single segment wildcard)
  pattern = pattern.replace(/\*(?!\*)/g, '[\\w.-]+');

  // 4) Special :list placeholder -> comma-separated list of tokens
  //    Example: :list -> SRDSS,ERTT,SAA,SSSS
  pattern = pattern.replace(/:list\b/g, '[\\w.-]+(?:,[\\w.-]+)*');

  // 5) Other named params like :id, :type etc. -> single token
  pattern = pattern.replace(/:[\w.-]+\b/g, '[\\w.-]+');

  // 6) Anchor the pattern
  return new RegExp('^' + pattern + '$');
}


/**
 * To check if req path exists on mock data
 */
function isMatchingPathExists(req, mockData) {
    let { path, method: reqMethod } = req;
    let { url: mockPath, method: mockMethod } = mockData?.request; 

    // removing starting and trailing /
    path = path.replace(/^\//, '').replace(/\/$/, '');
    mockPath = mockPath.replace(/^\//, '').replace(/\/$/, '');  
    const regexEval = buildMockPathRegex(mockPath);

    if (reqMethod?.toLowerCase() !== mockMethod?.toLowerCase()) {
        return false;
    } else if (!regexEval?.test(path)) {
        return false;
    }

    return true;
}


module.exports = {
    getMatchingDummyData
};
