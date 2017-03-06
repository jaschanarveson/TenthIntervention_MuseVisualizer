
//~toNode = NetAddr.new("localhost", 8888);

OSCFunc(
	func: {arg msg, time, addr, recvPort;
		"from Node: %, %, %, %".format(msg, time, addr, recvPort).postln;
	},
	path: "/forward/1",
	recvPort: 7777
);

/*t = Task({
	loop({
		var num = rrand(1, 100);
		num.postln;
		~toNode.sendMsg("/fromSC", num);
		1.wait;
	});
});*/

//t.play(SystemClock);

