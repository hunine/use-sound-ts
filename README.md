# Support sound control using Web Audio API

If you use the Audio element to play some sound with the `loop = true` property, you may encounter issues.

At the end of the sound, there can be a gap before the sound starts again with the `loop` property

This package will help you solve this problem by using the Web Audio API.

## Installation
You can install this package using the following command line tools:

Package can be added using **npm**:
```bash
npm install @hunine/use-sound-ts
```
or, use **pnpm**:
```bash
pnpm add @hunine/use-sound-ts
```
or, use **yarn**:
```bash
yarn add @hunine/use-sound-ts
```

## Example
```ts
import useSound from 'use-sound';

import rainAmbience from '../../sounds/rain.wav';

const PlayRainingButton = () => {
  const { playSound } = useSound(rainAmbience);

  return <button onClick={playSound}>Play</button>;
};
```