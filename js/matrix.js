import { Matrixes, Signs } from './constants.js';
import { fillArray, getRandomPosition } from './utils.js';

/**
 * Generates matrix and handles events vs calculations
 */
export class Matrix {
  /**
   * @param {string} matrixType 
   * @param {HTMLDomElement} root
   */
  constructor (matrixType, root) {
    if (!matrixType || typeof matrixType !== 'string' || !Matrixes[matrixType])
      throw new Error(`Wrong matrix type: ${matrixType}`)

      this.meta = Matrixes[matrixType];
      this.root = root;
      this.root.classList.add(matrixType);
      this._handleCellClick = this._handleCellClick.bind(this);

      this._reset();

      this.root.addEventListener('mousedown', this._handleCellClick);
      this.root.addEventListener('contextmenu', e => e.preventDefault());
  }

  _reset () {
    this._setEmptyMatrix();
    this._renderAll();
    this.firstClick = true;
  }

  /**
   * 
   * @param {*} start 
   */
  init (start) {
    const { x, y } = start;

    this.firstClick = false;
    this._fillEmptyRegion(x, y);
    this._setMines();
    this._calculateQuantities();
    this._reRenderAll();
    this._openUp(x, y);
  }

  _handleCellClick (evt) {
    const el = evt.target;
    const { x, y } = el.dataset;

    if (evt.button === 0) {
      if (this.firstClick) {
        this.init({ x, y});

        return
      }

      if(this.states[y][x] !== Signs.HIDDEN) return;

      // Left mouse button
      if(this.values[y][x] === Signs.D0) {
        this._openUp(+x, +y)
      } else if(this.values[y][x] !== Signs.MINE) {
        this._openCell(+x, +y)
      } else this._caput()
    } else if (evt.button === 2) {
      // Right mouse button
      if(this.states[y][x] !== Signs.OPEN) {
        if(this.states[y][x] === Signs.FLAG) {
          this.states[y][x] = Signs.HIDDEN;
        } else {
          this.states[y][x] = Signs.FLAG;
        }
        this._renderCell(x, y)
      }
    }
  }

  _caput () {
    this._openAll();
    alert('BADABUM!');
  }

  /**
   * 
   */
  _setEmptyMatrix () {
    const { width, height } = this.meta;
    
    if (this.values) throw new Error('Matrix already initialized.')

    this.values = Array(height).fill([]).map(() => fillArray(width, Signs.EMPTY));
    this.states = Array(height).fill([]).map(() => fillArray(width, Signs.HIDDEN));
    this.selectors = Array(height).fill([]).map(() => fillArray(width, null));
  }

  /**
   * Fills empty initial region at first click coordinates
   * @param {Matrix} matrix 
   * @param {number} x 
   * @param {number} y 
   */
  _fillEmptyRegion (x, y) {
    if (!this.values) this._setEmptyMatrix();

    const { width, height, iekx, ieky } = this.meta;

    let regionWidth = Math.floor(width * iekx);
    let regionHeight = Math.floor(height * ieky);

    if (regionWidth % 2 === 0) regionWidth += 1
    if (regionHeight % 2 === 0) regionHeight += 1

    const regionWidth2 = Math.floor(regionWidth / 2);
    const regionHeight2 = Math.floor(regionHeight / 2);
    const startX = x - regionWidth2;
    const startY = y - regionHeight2;
    const maxX = width - regionWidth;
    const maxY = height - regionHeight;
    let shiftX = 0;
    let shiftY = 0;

    if (startX < 0) shiftX = 0 - startX;
    if (startY < 0) shiftY = 0 - startY;
    if (startX > maxX) shiftX = maxX - startX;
    if (startY > maxY) shiftY = maxY - startY;

    for(let yy = 0; yy < regionHeight; yy++) {
      for(let xx = 0; xx < regionWidth; xx++) {
        const cellX = startX + xx + shiftX;
        const cellY = startY + yy + shiftY;
        
        this.values[cellY][cellX] = Signs.D0;
      }
    }
  }

  _setMines () {
    if (!this.values) throw new Error('Call init first')

    const { mines, type } = this.meta;

    for (let i = 0; i < mines; ) {
      const {x, y} = getRandomPosition(type);

      if (this.values[y][x] === Signs.EMPTY) {
        i++;
        this.values[y][x] = Signs.MINE;
      }
    }
  }

  _getMinesAround (x, y) {
    const { width, height } = this.meta;
    let count = 0;

    for(let yy = -1; yy < 2; yy++) {
      for(let xx = -1; xx < 2; xx++) {
        const _y = y + yy;
        const _x = x + xx;

        if (_y < 0 || _y >= height) continue;
        if (_x < 0 || _x >= width) continue;

        if (this.values[_y][_x] === Signs.MINE) count++;
      }  
    }

    return `${count}`;
  }

  _calculateQuantities () {
    const { width, height } = this.meta;
    
    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
        if (this.values[y][x] !== Signs.MINE) {
          this.values[y][x] = this._getMinesAround(x, y)
        }
      }
    }
  }

  _openCell (x, y) {
    this.states[y][x] = Signs.OPEN;
    this._renderCell(x, y);
  }

  _openAll () {
    const { width, height } = this.meta;

    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
        this.states[y][x] = Signs.OPEN;
        this._renderCell(x, y);
      }
    }
  }

  _openUp (x, y) {
    const { width, height } = this.meta;

    if (this.values[y][x] !== Signs.MINE && this.states[y][x] !== Signs.OPEN) {
      this._openCell(x, y);

      for(let yy = -1; yy < 2; yy++) {
        for(let xx = -1; xx < 2; xx++) {
          const _y = y + yy;
          const _x = x + xx;

          if (
            yy === xx || yy === -xx || // don't check diagonals
            _y < 0 || _y >= height || _x < 0 || _x >= width || // outbond
            _x === x && _y === y // same point, already checked
          ) continue;

          if (this.values[_y][_x] === Signs.D0) this._openUp(_x, _y);
          if (this.values[_y][_x] !== Signs.MINDES) this._openCell(_x, _y);
        }  
      }
    }
  }

  _getCellCalss(x, y) {
    return `cell_y${y}_x${x}`;
  }
  
  _renderCellContents (x, y) {
    let content = this.states[y][x] === Signs.OPEN ? this.values[y][x] : Signs.EMPTY;
    // let content = this.values[y][x];
    const stateClass = this.states[y][x] === Signs.OPEN ? 'open' : 'hidden';

    if (this.states[y][x] === Signs.FLAG) content = Signs.FLAG;
    if (content === Signs.D0) content = Signs.EMPTY;

    return `<div class="cell ${this._getCellCalss(x, y)}"><div data-x="${x}" data-y="${y}" class="${stateClass}">${content}</div></div>`;
  }

  _getCellSelector (x, y) {
    if (!this.selectors[y][x]) {
      this.selectors[y][x] = this.root.querySelector(`.${this._getCellCalss(x, y)}`);
    } 
    
    return this.selectors[y][x]
  }

  _renderCell (x, y) {
    const selector = this._getCellSelector(x, y);
    
    selector.innerHTML = this._renderCellContents(x, y);
  }

  _renderAll () {
    const { width, height } = this.meta;
    const cells = [];

    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
         cells.push(this._renderCellContents(x, y));
      }
    }

    this.root.innerHTML = cells.join('');
  }

  _reRenderAll () {
    const { width, height } = this.meta;
    const cells = [];

    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
        this._renderCell(x, y);
      }
    }
  }
}
