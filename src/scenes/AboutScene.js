export class AboutScene extends Phaser.Scene {
  constructor() { super('AboutScene'); }
  create() {
    this.cameras.main.setBackgroundColor('#0d1122');
    this.add.text(this.scale.width/2,76,'ستارلايت: ما دون النجوم',{fontFamily:'Tahoma',fontSize:'42px',color:'#f1f5ff'}).setOrigin(0.5);
    const text='لعبة عربية بكسل آرت عن الرحلة التي يظن فيها الإنسان أنه يقاتل العالم، حتى يكتشف أن آخر باب كان يحرسه من الداخل.\n\nفي هذه الرحلة، لا تكفي قوة السلاح.\nفالنجوم لا يبلغها من لم يواجه ظلمته.\n\nصُنعت بواسطة Ragnar (@abusqr)';
    this.add.text(this.scale.width/2,250,text,{fontFamily:'Tahoma',fontSize:'26px',color:'#d7e6ff',align:'center',wordWrap:{width:860}}).setOrigin(0.5);
    this.add.text(this.scale.width/2,500,'العودة إلى القائمة الرئيسية',{fontFamily:'Tahoma',fontSize:'26px',color:'#fff',backgroundColor:'#2b4677',padding:{left:14,right:14,top:8,bottom:8}}).setOrigin(0.5).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.start('MainMenuScene'));
  }
}
