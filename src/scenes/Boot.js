import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        const textStyle = { fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        const instructions = [
            'Ton coin generating!',
            'Please wait...',
        ]

        this.add.text(450, 900, instructions, textStyle).setAlign('center').setOrigin(0.5);
    }

    create ()
    {
        //  A global value to store the highscore in
        this.registry.set('highscore', 0);

        // this.scene.start('Preloader');

        this.input.once('pointerdown', () => {

            this.scene.start('Preloader');

        });
    }
}
