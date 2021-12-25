export const Signs = {
  MINE: 'M',
  FLAG: 'F',
  EMPTY: ' ',
  HIDDEN: 'H',
  OPEN: 'O',
  D0: '0',
  D1: '1',
  D2: '2',
  D3: '3',
  D4: '4',
  D5: '5',
  D6: '6',
  D7: '7',
};

export const INITIAL_CELL = {
  value: Signs.EMPTY,
  state: Signs.HIDDEN,
};

export const MatrixTypes = {
  PRO: 'PRO'
}

export const Matrixes = {
  [MatrixTypes.PRO]: { 
    type: MatrixTypes.PRO,
    width: 30, 
    height: 16, 
    mines: 99,
    iekx: 0.2, //initial empty koef for X
    ieky: 0.25, //initial empty koef for Y
  },
};

export const MAX_MINES_KOEF = 0.3;
