// KeyLoMark — the house-and-key mark traced from the official artwork.
// The A-frame house (roof) + lime keyring (with its 2x2 lime-block detail) + key.
// Props:
//   className — sizing classes (e.g. "h-8 w-auto"); aspect ratio is 1024:590
//   roof      — fill color for the roof + key (default black)
//   lime      — fill color for the ring + blocks (default brand lime)
export default function KeyLoMark({ className = '', roof = '#000000', lime = '#C7F000' }) {
  const roofPath =
    'M523 325 L498 326 L480 334 L462 353 L455 374 L456 394 L465 415 L479 429 L500 440 L500 578 L513 589 L526 578 L529 559 L549 558 L553 554 L550 539 L530 538 L526 534 L529 523 L548 523 L553 519 L551 504 L526 500 L526 439 L554 422 L564 408 L570 390 L568 365 L558 346 L545 334 Z M504 347 L521 347 L532 352 L542 362 L548 376 L543 400 L529 413 L517 417 L494 412 L482 400 L477 387 L477 375 L483 362 Z M545 0 L629 11 L706 36 L787 79 L853 130 L920 204 L973 291 L997 348 L1010 390 L1020 436 L1023 474 L1023 0 Z M480 0 L0 0 L0 487 L10 407 L38 319 L80 239 L108 199 L146 155 L177 125 L227 86 L305 42 L384 14 L432 4 Z';
  const limePath =
    'M532 277 L517 279 L519 293 L533 292 Z M493 277 L492 292 L507 294 L508 279 Z M518 252 L517 266 L531 268 L533 253 Z M496 251 L492 256 L493 266 L507 267 L508 253 Z M393 265 L391 273 L394 280 L405 284 L407 377 L414 386 L422 389 L446 389 L446 372 L429 372 L424 367 L424 266 L497 202 L515 192 L601 266 L601 368 L595 372 L581 372 L579 388 L608 388 L618 378 L620 285 L632 278 L633 268 L518 168 L511 167 L502 172 Z';

  return (
    <svg className={className} viewBox="0 0 1024 590" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d={roofPath} fill={roof} fillRule="evenodd" />
      <path d={limePath} fill={lime} fillRule="evenodd" />
    </svg>
  );
}
