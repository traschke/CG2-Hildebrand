/* requireJS module definition */
define(["three", 'ellipsoid', "BufferGeometry"],
    (function(THREE, Ellipsoid, BufferGeometry) {

        "use strict";

        /**
         *
         * @param scene  - reference to the scene
         * @constructor
         */
        var Robot = function () {

			var headSize = [75 ,75, 75];
			var torsoSize = [250 ,400 ,150];
			var tightSize = [80, 150, 80];
			var lowerSize = [65, 130, 65];
			var footSize =[100, 50, 65];
			var kneeSize = [50, 50, 40, 32];
			var ankleSize = [40, 40, 30, 32];
			var shoulderSize = [50, 50, 30, 32];
			var ellbowSize = [40, 40, 30, 32];
			var handSize = [40, 40, 40];
			var hipSize = [60, 60, 30, 32];
			this.root = new THREE.Object3D();

			// skeleton
			this.head = new THREE.Object3D();
			this.head.name = "head"; 
			this.head.translateY(torsoSize[1]/2 + headSize[1]/2);

			this.tightleg1 = new THREE.Object3D();
			this.tightleg1.name = "tightleg1";
			this.tightleg1.translateY(- tightSize[1]/2);

			this.tightleg2 = new THREE.Object3D();
			this.tightleg2.name = "tightleg2";
			this.tightleg2.translateY(- tightSize[1]/2);

			this.hip1 = new THREE.Object3D();
			this.hip1.name = "hip1";
			this.hip1.translateY(-torsoSize[1]/2);
			this.hip1.translateX(-torsoSize[0]/4);

			this.hip2 = new THREE.Object3D();
			this.hip2.name = "hip2";
			this.hip2.translateY(-torsoSize[1]/2);
			this.hip2.translateX(torsoSize[0]/4);

			this.knee1 = new THREE.Object3D();
			this.knee1.name = "knee1";
			this.knee1.translateY(-tightSize[1]/2);

			this.knee2 = new THREE.Object3D();
			this.knee2.name = "knee2";
			this.knee2.translateY(-tightSize[1]/2);

			this.lowerleg1 = new THREE.Object3D();
			this.lowerleg1.name = "lowerleg1";
			this.lowerleg1.translateY(-lowerSize[1]/2);

			this.lowerleg2 = new THREE.Object3D();
			this.lowerleg2.name = "lowerleg2";
			this.lowerleg2.translateY(-lowerSize[1]/2);

			this.ankle1 = new THREE.Object3D();
			this.ankle1.name = "ankle1";
			this.ankle1.translateY(-lowerSize[1]/2);

			this.ankle2 = new THREE.Object3D();
			this.ankle2.name = "ankle2";
			this.ankle2.translateY(-lowerSize[1]/2);

			this.foot1 = new THREE.Object3D();
			this.foot1.name = "foot1";
			this.foot1.translateY(-footSize[1]/2);

			this.foot2 = new THREE.Object3D();
			this.foot2.name = "foot1";
			this.foot2.translateY(-footSize[1]/2);

			this.tightarm1 = new THREE.Object3D();
			this.tightarm1.name = "tightarm1";
			this.tightarm1.translateY(-shoulderSize[1]);
			this.tightarm1.translateX(-shoulderSize[1]);

			this.tightarm2 = new THREE.Object3D();
			this.tightarm2.name = "tightarm2";
			this.tightarm2.translateY(-shoulderSize[1]);
			this.tightarm2.translateX(shoulderSize[1]);

			this.lowerarm1 = new THREE.Object3D();
			this.lowerarm1.name = "lowerarm1";
			this.lowerarm1.translateY(- lowerSize[1]/2);

			this.lowerarm2 = new THREE.Object3D();
			this.lowerarm2.name = "lowerarm1";
			this.lowerarm2.translateY(- lowerSize[1]/2);

			this.shoulder1 = new THREE.Object3D();
			this.shoulder1.name = "shoulder1";
			this.shoulder1.translateY(torsoSize[1]/4 + shoulderSize[1]/2);
			this.shoulder1.translateX(-torsoSize[0]/2);

			this.shoulder2 = new THREE.Object3D();
			this.shoulder2.name = "shoulder2";
			this.shoulder2.translateY(torsoSize[1]/4 + shoulderSize[1]/2);
			this.shoulder2.translateX(torsoSize[0]/2);

			this.ellbow1 = new THREE.Object3D();
			this.ellbow1.name = "ellbow1";
			this.ellbow1.translateY(-tightSize[1]/2);

			this.ellbow2 = new THREE.Object3D();
			this.ellbow2.name = "ellbow2";
			this.ellbow2.translateY(-tightSize[1]/2);

			this.hand1 = new THREE.Object3D();
			this.hand1.name = "hand1";
			this.hand1.translateY(-lowerSize[1]/2);

			this.hand2 = new THREE.Object3D();
			this.hand2.name = "hand2";
			this.hand2.translateY(-lowerSize[1]/2);

			this.torso = new THREE.Object3D();
			this.torso.add(this.head);
			this.hip1.add(this.tightleg1);
			this.hip2.add(this.tightleg2);
			this.torso.add(this.hip1);
			this.torso.add(this.hip2);
			this.knee1.add(this.lowerleg1);
			this.knee2.add(this.lowerleg2);
			this.ankle1.add(this.foot1);
			this.ankle2.add(this.foot2);
			this.shoulder1.add(this.tightarm1);
			this.shoulder2.add(this.tightarm2);
			this.ellbow1.add(this.lowerarm1);
			this.ellbow2.add(this.lowerarm2);
			this.tightleg1.add(this.knee1);
			this.tightleg2.add(this.knee2);
			this.lowerleg1.add(this.ankle1);
			this.lowerleg2.add(this.ankle2);
			this.torso.add(this.shoulder1);
			this.torso.add(this.shoulder2);
			this.tightarm1.add(this.ellbow1);
			this.tightarm2.add(this.ellbow2);
			this.lowerarm1.add(this.hand1);
			this.lowerarm2.add(this.hand2);

			// skin
			//this.headSkin = new THREE.Mesh( new THREE.CubeGeometry( headSize[0], headSize[1], headSize[2]) , new THREE.MeshNormalMaterial() );
			var config = {
				umin : parseFloat(0),
				umax : parseFloat(1000),
				vmin : parseFloat(0),
				vmax : parseFloat(1000),
				uSegments : parseFloat(100),
				vSegments : parseFloat(100)
			};

			var ellip = new Ellipsoid(headSize[0], headSize[1], headSize[2], config);

			var bufferGeometry = new BufferGeometry(false, false, false);
			bufferGeometry.setIndex(ellip.getIndices());
			bufferGeometry.addAttribute('position', ellip.getPositions());
			bufferGeometry.addAttribute('color', ellip.getColors());

			this.meshMaterial = new THREE.MeshBasicMaterial( {
				vertexColors: THREE.VertexColors,
				side: THREE.DoubleSide
			});


			this.headSkin = new THREE.Mesh(bufferGeometry.geometry, this.meshMaterial);
			this.headSkin.rotateY( Math.PI/4 );

			this.tightleg1Skin = new THREE.Mesh( new THREE.CubeGeometry( tightSize[0], tightSize[1], tightSize[2]) , new THREE.MeshNormalMaterial() ); 
			this.tightleg2Skin = new THREE.Mesh( new THREE.CubeGeometry( tightSize[0], tightSize[1], tightSize[2]) , new THREE.MeshNormalMaterial() );

			this.lowerleg1Skin = new THREE.Mesh( new THREE.CubeGeometry( lowerSize[0], lowerSize[1], lowerSize[2]) , new THREE.MeshNormalMaterial() );
			this.lowerleg2Skin = new THREE.Mesh( new THREE.CubeGeometry( lowerSize[0], lowerSize[1], lowerSize[2]) , new THREE.MeshNormalMaterial() );  

			this.foot1Skin = new THREE.Mesh( new THREE.CubeGeometry( footSize[0], footSize[1], footSize[2]) , new THREE.MeshNormalMaterial() );
			this.foot2Skin = new THREE.Mesh( new THREE.CubeGeometry( footSize[0], footSize[1], footSize[2]) , new THREE.MeshNormalMaterial() );

			this.tightarm1Skin = new THREE.Mesh( new THREE.CubeGeometry( tightSize[0], tightSize[1], tightSize[2]) , new THREE.MeshNormalMaterial() );
			this.tightarm2Skin = new THREE.Mesh( new THREE.CubeGeometry( tightSize[0], tightSize[1], tightSize[2]) , new THREE.MeshNormalMaterial() );

			this.lowerarm1Skin = new THREE.Mesh( new THREE.CubeGeometry( lowerSize[0], lowerSize[1], lowerSize[2]) , new THREE.MeshNormalMaterial() );
			this.lowerarm2Skin = new THREE.Mesh( new THREE.CubeGeometry( lowerSize[0], lowerSize[1], lowerSize[2]) , new THREE.MeshNormalMaterial() );

			this.knee1Skin = new THREE.Mesh(new THREE.CylinderGeometry(kneeSize[0], kneeSize[1], kneeSize[2], kneeSize[3]), new THREE.MeshNormalMaterial());
			this.knee2Skin = new THREE.Mesh(new THREE.CylinderGeometry(kneeSize[0], kneeSize[1], kneeSize[2], kneeSize[3]), new THREE.MeshNormalMaterial());

			this.ankle1Skin = new THREE.Mesh(new THREE.CylinderGeometry(ankleSize[0], ankleSize[1], ankleSize[2], ankleSize[3]), new THREE.MeshNormalMaterial());
			this.ankle2Skin = new THREE.Mesh(new THREE.CylinderGeometry(ankleSize[0], ankleSize[1], ankleSize[2], ankleSize[3]), new THREE.MeshNormalMaterial());

			this.shoulder1Skin = new THREE.Mesh(new THREE.CylinderGeometry(shoulderSize[0], shoulderSize[1], shoulderSize[2], shoulderSize[3]), new THREE.MeshNormalMaterial());
			this.shoulder1Skin.rotateZ( Math.PI/2 );
			this.shoulder2Skin = new THREE.Mesh(new THREE.CylinderGeometry(shoulderSize[0], shoulderSize[1], shoulderSize[2], shoulderSize[3]), new THREE.MeshNormalMaterial());
			this.shoulder2Skin.rotateZ( Math.PI/2 );

			this.ellbow1Skin = new THREE.Mesh(new THREE.CylinderGeometry(ellbowSize[0], ellbowSize[1], ellbowSize[2], ellbowSize[3]), new THREE.MeshNormalMaterial());
			this.ellbow2Skin = new THREE.Mesh(new THREE.CylinderGeometry(ellbowSize[0], ellbowSize[1], ellbowSize[2], ellbowSize[3]), new THREE.MeshNormalMaterial());

			this.hand1Skin = new THREE.Mesh(new THREE.SphereGeometry(handSize[0], handSize[1], handSize[2]), new THREE.MeshNormalMaterial());
			this.hand2Skin = new THREE.Mesh(new THREE.SphereGeometry(handSize[0], handSize[1], handSize[2]), new THREE.MeshNormalMaterial());

			this.hip1Skin = new THREE.Mesh(new THREE.CylinderGeometry(hipSize[0], hipSize[1], hipSize[2], hipSize[3]), new THREE.MeshNormalMaterial());
			this.hip2Skin = new THREE.Mesh(new THREE.CylinderGeometry(hipSize[0], hipSize[1], hipSize[2], hipSize[3]), new THREE.MeshNormalMaterial());

			this.torsoSkin = new THREE.Mesh( new THREE.CubeGeometry(torsoSize[0], torsoSize[1], torsoSize[2]), new THREE.MeshNormalMaterial() );

			this.torso.add(this.torsoSkin);
			this.head.add(this.headSkin);
			this.tightleg1.add(this.tightleg1Skin);
			this.tightleg2.add(this.tightleg2Skin);
			this.lowerleg1.add(this.lowerleg1Skin);
			this.lowerleg2.add(this.lowerleg2Skin);
			this.foot1.add(this.foot1Skin);
			this.foot2.add(this.foot2Skin);
			this.tightarm1.add(this.tightarm1Skin);
			this.tightarm2.add(this.tightarm2Skin);
			this.lowerarm1.add(this.lowerarm1Skin);
			this.lowerarm2.add(this.lowerarm2Skin);
			this.knee1.add(this.knee1Skin);
			this.knee2.add(this.knee2Skin);
			this.ankle1.add(this.ankle1Skin);
			this.ankle2.add(this.ankle2Skin);
			this.shoulder1.add(this.shoulder1Skin);
			this.shoulder2.add(this.shoulder2Skin);
			this.ellbow1.add(this.ellbow1Skin);
			this.ellbow2.add(this.ellbow2Skin);
			this.hand1.add(this.hand1Skin);
			this.hand2.add(this.hand2Skin);
			this.hip1.add(this.hip1Skin);
			this.hip2.add(this.hip2Skin);

			this.root.add(this.torso);

			this.getMesh = function(){
					return this.root;
			}

        };

        return Robot;
    }));