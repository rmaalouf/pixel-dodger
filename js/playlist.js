i=1;
intro_track=[];
ending_track=[];
track=[];


track.push("media/audio/decisivebattle.mp3");
track.push("media/audio/megaman.mp3");
track.push("media/audio/castlevania.mp3");
track.push("media/audio/balloonfight.mp3");
track.push("media/audio/lifeforce.mp3");
track.push("media/audio/gunsmoke.mp3");
track.push("media/audio/ghostgoblins.mp3");
track.push("media/audio/punchout.mp3");
track.push("media/audio/rygar.mp3");
track.push("media/audio/kartwario.mp3");
track.push("media/audio/kartmoomoo.mp3");
track.push("media/audio/ssbjungle.mp3");
track.push("media/audio/ssbcorneria.mp3");
track.push("media/audio/tetrismain.mp3");
track.push("media/audio/tetrismain2.mp3");
track.push("media/audio/ssbflatzone.mp3");
track.push("media/audio/tetris3.mp3");
track.push("media/audio/sf2ken.mp3");
track.push("media/audio/sf2ryu.mp3");
track.push("media/audio/sf2guile.mp3");
track.push("media/audio/goldeneyeescape.mp3");
track.push("media/audio/goldeneyerunway.mp3");
track.push("media/audio/ocarinahorse.mp3");
track.push("media/audio/supermariokartcircuit.mp3");
track.push("media/audio/supermariokartrainbow.mp3");
track.push("media/audio/sf2vega.mp3");
track.push("media/audio/7thsagalejesrimul.mp3");
track.push("media/audio/sotnmarble.mp3");
track.push("media/audio/sotnwoodcarving.mp3");

intro_track.push("media/audio/mario3.mp3");
intro_track.push("media/audio/zelda.mp3");
intro_track.push("media/audio/clucluland.mp3");
intro_track.push("media/audio/kefka.mp3");
intro_track.push("media/audio/metroid.mp3");
intro_track.push("media/audio/wizardswarriors.mp3");
intro_track.push("media/audio/kart64.mp3");
intro_track.push("media/audio/tetrisintro1.mp3");
intro_track.push("media/audio/goldeneyemission.mp3");
intro_track.push("media/audio/iceclimbertheme.mp3");
intro_track.push("media/audio/iceclimberstage.mp3");
intro_track.push("media/audio/starfoxopening.mp3");
intro_track.push("media/audio/linktothepasttitle.mp3");
intro_track.push("media/audio/linktothepastopening.mp3");
intro_track.push("media/audio/linktothepastkakariko.mp3");
intro_track.push("media/audio/linktothepastselect.mp3");
intro_track.push("media/audio/ocarinashop.mp3");
intro_track.push("media/audio/ocarinawoods.mp3");
intro_track.push("media/audio/ocarinahymne.mp3");
intro_track.push("media/audio/ocarinazelda.mp3");
intro_track.push("media/audio/supermariokart.mp3");
intro_track.push("media/audio/sf2select.mp3");
intro_track.push("media/audio/sf2blanka.mp3");
intro_track.push("media/audio/7thsagaesuna.mp3");
intro_track.push("media/audio/7thsagafortresscity.mp3");
intro_track.push("media/audio/7thsagalivelyvillage.mp3");
intro_track.push("media/audio/scterran.mp3");
intro_track.push("media/audio/sotnprayer.mp3");
intro_track.push("media/audio/sotndance.mp3");
intro_track.push("media/audio/sotnrequiem.mp3");

ending_track.push("media/audio/punchout.mp3");

randomize_playlist(track);
randomize_playlist(intro_track);


function randomize_playlist (array) {

	var currentIndex = array.length, temporaryValue, randomIndex;

	while(0 !== currentIndex) {

		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex]=array[randomIndex];
		array[randomIndex]=temporaryValue;
		}

};

audio.addEventListener('ended',function(){

	audio.src=track[i]
	audio.play();

	i++;
	if (i> track.length) i=0;
})
