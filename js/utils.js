import { Signs, Matrixes } from './constants.js';

/**
 * Generates random integer number between 0..max-1
 * @param {number} max 
 * @returns 
 */
export const getRandom = max => Math.floor(Math.random() * max);

/**
 * Creates new array of length elements, filled by content
 * @param {number} length 
 * @param {string} content 
 * @returns 
 */
export const fillArray = (length, content = Signs.EMPTY) => Array(length).fill(content);

 /**
 * Generates random first click coordinates according to selected matrix type
 * @param {Matrix} matrix 
 * @returns 
 */
export const getRandomPosition = matrixType => {
  if (!Matrixes[matrixType]) throw new Error(`Wrong matrix type: ${matrixType}`);

  const matrix = Matrixes[matrixType];

  return {
    x: getRandom(matrix.width),
    y: getRandom(matrix.height),
  };
};