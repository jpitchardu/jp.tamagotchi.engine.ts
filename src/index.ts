import scope from 'fndi';

function main(resolve) {
  const x = 1 + 1;
}

const scopedMain = scope(main);
