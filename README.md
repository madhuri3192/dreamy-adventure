# Dreamy Fairy Adventure

A customizable 2D endless-runner arcade game made with HTML, CSS and JavaScript Canvas for Multimedia Systems Lab Test 2.

## Run the game
1. Extract `Dreamy_Fairy_Adventure.zip`.
2. Open the folder in Visual Studio Code.
3. Install the **Live Server** extension (if it is not already installed).
4. Right-click `index.html` → **Open with Live Server**.
   - Alternatively, double-click `index.html` to open it in a modern browser.

## Controls
- Left / Right arrows: move the fairy horizontally.
- Up arrow or Space: jump.
- Down arrow: duck while on the ground.
- Escape or the pause button: pause/resume.
- On a phone/tablet, use the on-screen arrow buttons.

## Rules
- Collect golden stars: +10 points.
- Collect a rainbow shield: temporary protection for 7 seconds.
- Avoid wooden logs and crates. A hit costs one heart.
- The player starts with 3 lives. The game ends when all lives are lost or the 90-second timer reaches zero.
- Game speed increases gradually as time passes.
- A shield collision destroys the obstacle and awards +5 points.

## Customization implemented
- Fairy-forest fantasy theme with a custom-drawn chibi runner, castle, floating islands, cherry tree and animated scenery.
- Three-life system.
- Rainbow shield power-up with timed protection.
- Star collection scoring and bonus points for shield-protected obstacle hits.
- Increasing difficulty / world speed.
- Start, playing, paused, game-over and restart states.
- Keyboard and touch controls.
- Generated sound effects using the browser Web Audio API (no audio files required).

## Algorithm overview
1. `requestAnimationFrame()` runs the continuous game loop.
2. Each frame calculates elapsed time (`dt`) and updates the player, world speed, timer, collectibles, obstacles and particles.
3. New stars, shields and obstacles spawn at intervals and move from right to left.
4. Axis-aligned bounding-box collision detection checks the player rectangle against obstacle rectangles. A distance check detects collectibles.
5. Collision rules update score, shield duration, lives and game state.
6. The Canvas API draws the background, player, objects, particles and HUD every frame.

## Files
- `index.html` — game interface and screens.
- `style.css` — layout, colours, responsive styling and buttons.
- `game.js` — game logic, animation, controls, collisions, score and sound.