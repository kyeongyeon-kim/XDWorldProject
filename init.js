/* 엔진 로드 후 실행할 초기화 함수(Module.postRun) */
function init() {

	Module.Start(window.innerWidth, window.innerHeight);
	initPage();
}

var GLOBAL = {
	Camera: null,
	population: null,
	worker: null,
	region: "busan",
	acceseToken: null,
	graphLayer: null,
	poiLayer: null,
	poi: null,
	year: [2016, 2017, 2018, 2019, 2020]
};

/* 엔진 로드 후 실행할 초기화 함수(Module.postRun) */
async function init() {
	GLOBAL.acceseToken = await getAccessToken();
	GLOBAL.population = await getPopInfomation([getPopByYear(GLOBAL.year[0]), getPopByYear(GLOBAL.year[1]), getPopByYear(GLOBAL.year[2]), getPopByYear(GLOBAL.year[3]), getPopByYear(GLOBAL.year[4])]);
	GLOBAL.worker = await getPopInfomation([getWorkerByYear(GLOBAL.year[0]), getWorkerByYear(GLOBAL.year[1]), getWorkerByYear(GLOBAL.year[2]), getWorkerByYear(GLOBAL.year[3]), getWorkerByYear(GLOBAL.year[4])]);
	// 엔진 초기화
	Module.Start(window.innerWidth, window.innerHeight);

	// 카메라 API 객체 반환
	GLOBAL.Camera = Module.getViewCamera();

	// 카메라 초기 위치 설정
	GLOBAL.Camera.move(new Module.JSVector3D(129.12263821366713, 35.178739294057365, 1000.0), 30.0, 0.0, 10);

	// 그래프 오브젝트 타입 레이어 생성
	var layerList = new Module.JSLayerList(true);
	GLOBAL.graphLayer = layerList.createLayer("LAYER_GRAPH", Module.ELT_GRAPH);

	// 그래프 생성
	let Graph = createGraph(129.12263821366713, 35.178739294057365 + 0.01);
	GLOBAL.graphLayer.addObject(Graph, 0);

	// point 요브젝트 생성
	let position = new Module.JSVector3D(129.12263821366713 - 0.0055, 35.178739294057365 + 0.011, 300);
	GLOBAL.poi = createPOI(position, {
		text: "지역별\n인구 및 IT 종사자 추이\n2016 ~ 2020\n제작 : 김경연\n자료 출처 : 통계청",
		font: "Consolas",
		fontSize: 20,
		fontColor: "rgba(0, 0, 0, 1.0)",
		backgroundColor: "rgba(255, 255, 255, 0.8)",
		outlineColor: "rgba(200, 200, 0, 0.5)",
		outlineWidth: 1,
	});

	GLOBAL.poiLayer = layerList.createLayer("POI_TEST", Module.ELT_3DPOINT);
	GLOBAL.poiLayer.addObject(GLOBAL.poi, 0);
}

// acceseToken 불러오기
async function getAccessToken() {
	var response = await jQuery.ajax({
		type: 'GET',
		url: 'https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json',
		data: {
			consumer_key: 'b2edafe7152a484a89a8',
			consumer_secret: 'a1be9e0165914152b296',
		},
		success: function (data) {
			var accessToken = data.result.accessToken;
			return accessToken;
		}
	});
	return response.result.accessToken;
}

// API를 활용한 인구 정보 불러오기
async function getPopInfomation(funcs) {
	return await Promise.all(funcs);
}

function getWorkerByYear(year) {
	return fetch("https://sgisapi.kostat.go.kr/OpenAPI3/stats/company.json?accessToken=" + GLOBAL.acceseToken + "&year=" + year + "&class_code=J")
		.then((resp) => resp.json())
		.then((arr) => {
			return new Map([
				['year', year],
				['seoul', parseInt(arr.result[0].tot_worker)],
				['busan', parseInt(arr.result[1].tot_worker)],
				['daegu', parseInt(arr.result[2].tot_worker)],
				['incheon', parseInt(arr.result[3].tot_worker)],
				['gwangju', parseInt(arr.result[4].tot_worker)],
				['daejeon', parseInt(arr.result[5].tot_worker)],
				['ulsan', parseInt(arr.result[6].tot_worker)],
				['sejong', parseInt(arr.result[7].tot_worker)],
				['gyeongi', parseInt(arr.result[8].tot_worker)],
				['gangwon', parseInt(arr.result[9].tot_worker)],
				['chungbuk', parseInt(arr.result[10].tot_worker)],
				['chungnam', parseInt(arr.result[11].tot_worker)],
				['jeonbuk', parseInt(arr.result[12].tot_worker)],
				['jeonnam', parseInt(arr.result[13].tot_worker)],
				['gyeongbuk', parseInt(arr.result[14].tot_worker)],
				['gyeongnam', parseInt(arr.result[15].tot_worker)],
				['jeju', parseInt(arr.result[16].tot_worker)]
			]);
		});
}

function getPopByYear(year) {
	return fetch("https://sgisapi.kostat.go.kr/OpenAPI3/stats/searchpopulation.json?accessToken=" + GLOBAL.acceseToken + "&year=" + year + "")
		.then((resp) => resp.json())
		.then((arr) => {
			return new Map([
				['year', year],
				['seoul', parseInt(arr.result[0].population)],
				['busan', parseInt(arr.result[1].population)],
				['daegu', parseInt(arr.result[2].population)],
				['incheon', parseInt(arr.result[3].population)],
				['gwangju', parseInt(arr.result[4].population)],
				['daejeon', parseInt(arr.result[5].population)],
				['ulsan', parseInt(arr.result[6].population)],
				['sejong', parseInt(arr.result[7].population)],
				['gyeongi', parseInt(arr.result[8].population)],
				['gangwon', parseInt(arr.result[9].population)],
				['chungbuk', parseInt(arr.result[10].population)],
				['chungnam', parseInt(arr.result[11].population)],
				['jeonbuk', parseInt(arr.result[12].population)],
				['jeonnam', parseInt(arr.result[13].population)],
				['gyeongbuk', parseInt(arr.result[14].population)],
				['gyeongnam', parseInt(arr.result[15].population)],
				['jeju', parseInt(arr.result[16].population)]
			]);
		});
}

/* 그래프 생성 */
function createGraph(longitude, latitude) {
	// 그래프 오브젝트 생성
	var graph = Module.createBarGraph("Graph");

	// 범례 추가
	graph.insertLegend("Legend1", "                         " + `Population(${GLOBAL.region})`, new Module.JSColor(200, 255, 255, 255));
	graph.insertLegend("Legend2", "                    IT 분야 종사자수", new Module.JSColor(200, 255, 255, 0));

	/* 데이터 추가 */
	// 데이터 셋 리스트 (데이터 순서는 범례 추가 순서를 따르며 데이터와 범례는 1:1 대응)
	var dataSetList = [];

	for (var i = 0; i < 5; i++) {
		var fieldName = (2016 + i) + '년';
		var populationData = GLOBAL.population[i].get(GLOBAL.region);
		var workerData = GLOBAL.worker[i].get(GLOBAL.region);
		var dataSet = {
			FieldName: fieldName,
			Data: [populationData, workerData],

			valueOf: function () {
				return this.Data;
			}
		};

		dataSetList.push(dataSet);
	}
	// data 최대값
	var max = dataSetList.reduce(function (a, b) {
		return Math.max(b.Data[0], b.Data[1]);
	}, -Infinity);

	// 그래프 객체에 데이터 추가
	for (var i = 0, len = dataSetList.length; i < len; i++) {

		// 데이터 전송 객체 생성
		var data = new Module.Collection();

		// 데이터 값 입력
		for (var j = 0, subLen = dataSetList[i].Data.length; j < subLen; j++) {
			data.add(dataSetList[i].Data[j]);
		}


		// 데이터 셋 명칭, 데이터 값으로 데이터 셋 입력
		graph.insertDataSet(dataSetList[i].FieldName, data);
	}

	// 그래프 y축 최대, 최소 값 범위 설정
	graph.setValueRange(0, Math.ceil(max / 1000000) * 1000000, 1000000);
	// 단위 표시 텍스트 설정
	graph.setUnitText("[단위 : 명]");

	// 바 상승 애니메이션 속도 설정
	graph.setAnimationSpeed(0.1);

	// 그래프 생성
	graph.create(new Module.JSVector3D(longitude, latitude, 100),
		new Module.JSSize2D(600, 500), 0);

	return graph;
}

/* 그래프 격자 출력 설정 */
function setGraphBackground(_bVisible) {

	if (GLOBAL.Graph == null) {
		return;
	}

	GLOBAL.Graph.setGridVisible(_bVisible);

	Module.XDRenderData();
}

/* 카메라 위치 이동 */
function setCameraPosition() {
	GLOBAL.graphLayer.removeAll();
	GLOBAL.poiLayer.removeAll();
	if (GLOBAL.Camera == null) {
		return;
	}

	// 경위도, 고도 좌표 값 받아오기
	var longitude = parseFloat(document.getElementById("longitude").value);
	var latitude = parseFloat(document.getElementById("latitude").value);
	var altitude = parseFloat(document.getElementById("altitude").value);

	let Graph = createGraph(longitude, latitude + 0.01, altitude);
	GLOBAL.graphLayer.addObject(Graph, 0);
	let position = new Module.JSVector3D(longitude - 0.0055, latitude + 0.011, 300);
	GLOBAL.poi = createPOI(position, {
		text: "지역별\n인구 및 IT 종사자 추이\n2016 ~ 2020\n제작 : 김경연\n자료 출처 : 통계청",
		font: "Consolas",
		fontSize: 20,
		fontColor: "rgba(0, 0, 0, 1.0)",
		backgroundColor: "rgba(255, 255, 255, 0.8)",
		outlineColor: "rgba(200, 200, 0, 0.5)",
		outlineWidth: 1,
	});
	GLOBAL.poiLayer.addObject(GLOBAL.poi, 0);
	if (isNaN(longitude) || isNaN(latitude) || isNaN(altitude)) {
		return;
	}

	// 카메라 이동 실행
	GLOBAL.Camera.setTilt(30.0);
	GLOBAL.Camera.setLocation(new Module.JSVector3D(longitude, latitude, altitude));
}

/* 장소 별 경위도, 고도 설정 */
function setPositionText(_positionType) {
	GLOBAL.region = _positionType;
	// 지정된 위치에 따른 경위도, 고도 텍스트 설정
	switch (_positionType) {
		case 'seoul':
			document.getElementById("longitude").value = "126.92836647767662";
			document.getElementById("latitude").value = "37.52439503321471";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'sejong':
			document.getElementById("longitude").value = "127.2494855";
			document.getElementById("latitude").value = "36.5040736";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'gangwon':
			document.getElementById("longitude").value = "127.72981975694272";
			document.getElementById("latitude").value = "37.885309626470516";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'incheon':
			document.getElementById("longitude").value = "126.7052062";
			document.getElementById("latitude").value = "37.4562557";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'gyeongi':
			document.getElementById("longitude").value = "127.05351636119418";
			document.getElementById("latitude").value = "37.28886826458665";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'chungbuk':
			document.getElementById("longitude").value = "127.49148710756499";
			document.getElementById("latitude").value = "36.63538195305526";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'chungnam':
			document.getElementById("longitude").value = "126.67270842023537";
			document.getElementById("latitude").value = "36.6587222831924";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'gyeongbuk':
			document.getElementById("longitude").value = "128.50582431682523";
			document.getElementById("latitude").value = "36.576021138531104";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'daejeon':
			document.getElementById("longitude").value = "127.38483458064697";
			document.getElementById("latitude").value = "36.35048482967665";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'daegu':
			document.getElementById("longitude").value = "128.6061273549514";
			document.getElementById("latitude").value = "35.87310069909742";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'jeonbuk':
			document.getElementById("longitude").value = "127.10895998268158";
			document.getElementById("latitude").value = "35.82010084553171";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'jeonnam':
			document.getElementById("longitude").value = "126.462797884342";
			document.getElementById("latitude").value = "34.81595779732931";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'gyeongnam':
			document.getElementById("longitude").value = "128.69195424226638";
			document.getElementById("latitude").value = "35.23767968213337";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'ulsan':
			document.getElementById("longitude").value = "129.3114744963032";
			document.getElementById("latitude").value = "35.53894382583284";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'gwangju':
			document.getElementById("longitude").value = "126.85166293522462";
			document.getElementById("latitude").value = "35.16007495961763";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'gwangju':
			document.getElementById("longitude").value = "126.85166293522462";
			document.getElementById("latitude").value = "35.16007495961763";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'busan':
			document.getElementById("longitude").value = "129.12263821366713";
			document.getElementById("latitude").value = "35.178739294057365";
			document.getElementById("altitude").value = "1000.0";
			break;
		case 'jeju':
			document.getElementById("longitude").value = "126.49823771803996";
			document.getElementById("latitude").value = "33.488830032800486";
			document.getElementById("altitude").value = "1000.0";
			break;
	}
}

/* POI 객체 생성 */
function createPOI(_position, _textOptions) {

	// POI 생성
	let point = Module.createPoint("TEXT_POI");
	point.setPosition(_position);

	let canvas = document.createElement("canvas");
	let ctx = canvas.getContext("2d");
	let boardImage = createBoardImage(ctx, _textOptions);
	point.setImage(boardImage.data, boardImage.width, boardImage.height);

	return point;
}

/* 캔버스로 POI 이미지 그리기 */
function createBoardImage(_ctx, _textOptions) {

	// 기본 폰트 설정
	let fontname, fontsize, linewidth;

	fontname = _textOptions.font;
	fontsize = _textOptions.fontSize;
	linewidth = _textOptions.outlineWidth;

	// font 설정 옵션
	_ctx.font = fontsize + "px " + fontname;	// 크기 및 폰트 

	// 길이 반환
	let strlist = _textOptions.text.split("\n");
	let width = 0;
	let linecount = 0;

	// 이미지 width와 높이 설정
	for (let item of strlist) {
		let w = _ctx.measureText(item).width
		if (w > width) width = w;
		linecount++;
	}

	_ctx.fillStyle = _textOptions.backgroundColor;		// 백그라운드 

	var rectWidth = width + _textOptions.fontSize;
	var rectHeight = _textOptions.fontSize * (linecount + 1);

	_ctx.fillRect(0, 0, width + _textOptions.fontSize, _textOptions.fontSize * (linecount + 1));
	_ctx.strokeRect(0, 0, width + _textOptions.fontSize, _textOptions.fontSize * (linecount + 1));

	_ctx.fillStyle = _textOptions.fontColor;
	_ctx.strokeStyle = _textOptions.outlineColor;
	_ctx.lineWidth = _textOptions.linewidth;
	_ctx.textBaseline = "middle";
	_ctx.textAlign = "center";

	linecount = 1;

	for (let item of strlist) {
		_ctx.strokeText(item, (width + _textOptions.fontSize) * 0.5, _textOptions.fontSize * linecount);
		_ctx.fillText(item, (width + _textOptions.fontSize) * 0.5, _textOptions.fontSize * linecount);
		linecount++;
	}

	return {
		width: rectWidth,
		height: rectHeight,
		data: _ctx.getImageData(0, 0, rectWidth, rectHeight).data,
	};
}

/*********************************************************
 * 엔진 파일을 로드합니다.
 * 파일은 asm.js파일, html.mem파일, js 파일 순으로 적용합니다.
 *********************************************************/

(function () {

	var tm = (new Date()).getTime();	// 캐싱 방지

	// 1. XDWorldEM.asm.js 파일 로드
	var file = "./engine/XDWorldEM.asm.js?tm=" + tm;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', file, true);
	xhr.onload = function () {

		var script = document.createElement('script');
		script.innerHTML = xhr.responseText;
		document.body.appendChild(script);

		// 2. XDWorldEM.html.mem 파일 로드
		setTimeout(function () {
			(function () {

				var memoryInitializer = "./engine/XDWorldEM.html.mem?tm=" + tm;
				var xhr = Module['memoryInitializerRequest'] = new XMLHttpRequest();
				xhr.open('GET', memoryInitializer, true);
				xhr.responseType = 'arraybuffer';
				xhr.onload = function () {

					// 3. XDWorldEM.js 파일 로드
					var url = "./engine/XDWorldEM.js?tm=" + tm;
					var xhr = new XMLHttpRequest();
					xhr.open('GET', url, true);
					xhr.onload = function () {
						var script = document.createElement('script');
						script.innerHTML = xhr.responseText;
						document.body.appendChild(script);
					};
					xhr.send(null);
				}
				xhr.send(null);
			})();
		}, 1);
	};
	xhr.send(null);

})();

/*********************************************************
 *	엔진파일 로드 후 Module 객체가 생성되며,
 *  Module 객체를 통해 API 클래스에 접근 할 수 있습니다.
 *	 - Module.postRun : 엔진파일 로드 후 실행할 함수를 연결합니다.
 *	 - Module.canvas : 지도를 표시할 canvas 엘리먼트를 연결합니다.
 *********************************************************/

var Module = {
	TOTAL_MEMORY: 256 * 1024 * 1024,
	postRun: [init],
	canvas: (function () {

		// Canvas 엘리먼트 생성
		var canvas = document.createElement('canvas');

		// Canvas id, Width, height 설정
		canvas.id = "canvas";
		canvas.width = "calc(100%)";
		canvas.height = "100%";

		// Canvas 스타일 설정
		canvas.style.position = "fixed";
		canvas.style.top = "0px";
		canvas.style.left = "0px";

		canvas.addEventListener("contextmenu", function (e) {
			e.preventDefault();
		});

		// 생성한 Canvas 엘리먼트를 body에 추가합니다.
		document.body.appendChild(canvas);

		return canvas;
	})()
};


