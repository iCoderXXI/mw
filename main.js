import { MatrixTypes } from './js/constants.js';
import { Matrix } from './js/matrix.js';
import { getRandomPosition } from './js/utils.js'

const ROOT_EL = document.querySelector('#root');

const matrixType = MatrixTypes.PRO
const matrix = new Matrix(matrixType, ROOT_EL);

// matrix.init(getRandomPosition(matrixType));
// matrix.init({ x: 10, y: 6 });
