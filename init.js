/* 엔진 로드 후 실행할 초기화 함수(Module.postRun) */
function init() {

	Module.Start(window.innerWidth, window.innerHeight);
	initPage();
}

var GLOBAL = {
	Camera: null,
	Graph: null,
	population: null,
	region: "busan"
};

// 년도 배열
var year = [2017, 2018, 2019, 2020, 2021];

/* 엔진 로드 후 실행할 초기화 함수(Module.postRun) */
async function init() {
	GLOBAL.population = await getPopInfomation();
	console.log(GLOBAL.population);
	console.log(GLOBAL.population[0]);
	console.log(GLOBAL.population[1]);
	console.log(GLOBAL.population[2]);
	console.log(GLOBAL.population[3]);
	console.log(GLOBAL.population[4]);
	console.log(GLOBAL.population[0].get("busan"));

	// 엔진 초기화
	Module.Start(window.innerWidth, window.innerHeight);

	// 카메라 API 객체 반환
	GLOBAL.Camera = Module.getViewCamera();

	// 카메라 초기 위치 설정
	GLOBAL.Camera.move(new Module.JSVector3D(129.128265, 35.171834, 1000.0), 30.0, 0.0, 10);

	// 그래프 오브젝트 타입 레이어 생성
	var layerList = new Module.JSLayerList(true);
	var layer = layerList.createLayer("LAYER_GRAPH", Module.ELT_GRAPH);

	// 그래프 생성
	GLOBAL.Graph = createGraph();
	layer.addObject(GLOBAL.Graph, 0);
}

// API를 활용한 인구 정보 불러오기
async function getPopInfomation() {
	return await Promise.all([getPopByYear(year[0]), getPopByYear(year[1]), getPopByYear(year[2]), getPopByYear(year[3]), getPopByYear(year[4])])
};

function getPopByYear(year) {
	return fetch("https://sgisapi.kostat.go.kr/OpenAPI3/stats/searchpopulation.json?accessToken=99eb12bc-40b1-4e97-98dd-000547a17669&year=" + year + "")
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
function createGraph() {
	// 그래프 오브젝트 생성
	var graph = Module.createBarGraph("Graph");

	// 범례 추가
	graph.insertLegend("Legend1", "Population(" + GLOBAL.region + ")", new Module.JSColor(200, 255, 255, 255));

	/* 데이터 추가 */
	// 데이터 셋 리스트 (데이터 순서는 범례 추가 순서를 따르며 데이터와 범례는 1:1 대응)
	var dataSetList = [
		{
			// 첫번째 데이터 셋 
			FieldName: "2017년",			// 데이터 셋의 명칭
			Data: [GLOBAL.population[0].get("busan")]
		},
		{
			// 두번째 데이터 셋 
			FieldName: "2018년",
			Data: [GLOBAL.population[1].get("busan")]
		},
		{
			// 세번째 데이터 셋
			FieldName: "2019년",
			Data: [GLOBAL.population[2].get("busan")]
		},
		{
			// 네번째 데이터 셋
			FieldName: "2020년",
			Data: [GLOBAL.population[3].get("busan")]
		},
		{
			// 다섯번째 데이터 셋
			FieldName: "2021년",
			Data: [GLOBAL.population[4].get("busan")]
		}
	];

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
	graph.setValueRange(0.0, 100.0, 10.0);

	// 바 상승 애니메이션 속도 설정
	graph.setAnimationSpeed(0.1);

	// 그래프 생성
	graph.create(new Module.JSVector3D(129.12263821366713, 35.178739294057365, 50.0),
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

/* 장소 별 경위도, 고도 설정 */
function setPositionText(_positionType) {
	GLOBAL.region = _positionType;
	// 지정된 위치에 따른 경위도, 고도 텍스트 설정
	switch (_positionType) {
		case 'seoul':
			document.getElementById("longitude").value = "126.92836647767662";
			document.getElementById("latitude").value = "37.52439503321471";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'sejong':
			document.getElementById("longitude").value = "127.2494855";
			document.getElementById("latitude").value = "36.5040736";
			document.getElementById("altitude").value = "10000.0";
			break;
		case 'gangwon':
			document.getElementById("longitude").value = "127.72981975694272";
			document.getElementById("latitude").value = "37.885309626470516";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'incheon':
			document.getElementById("longitude").value = "126.7052062";
			document.getElementById("latitude").value = "37.4562557";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'gyeongi':
			document.getElementById("longitude").value = "127.05351636119418";
			document.getElementById("latitude").value = "37.28886826458665";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'chungbuk':
			document.getElementById("longitude").value = "127.49148710756499";
			document.getElementById("latitude").value = "36.63538195305526";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'chungnam':
			document.getElementById("longitude").value = "126.67270842023537";
			document.getElementById("latitude").value = "36.6587222831924";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'gyeongbuk':
			document.getElementById("longitude").value = "128.50582431682523";
			document.getElementById("latitude").value = "36.576021138531104";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'daejeon':
			document.getElementById("longitude").value = "127.38483458064697";
			document.getElementById("latitude").value = "36.35048482967665";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'daegu':
			document.getElementById("longitude").value = "128.6061273549514";
			document.getElementById("latitude").value = "35.87310069909742";
			document.getElementById("altitude").value = "10000.0";
			break;
		case 'jeonbuk':
			document.getElementById("longitude").value = "127.10895998268158";
			document.getElementById("latitude").value = "35.82010084553171";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'jeonnam':
			document.getElementById("longitude").value = "126.462797884342";
			document.getElementById("latitude").value = "34.81595779732931";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'gyeongnam':
			document.getElementById("longitude").value = "128.69195424226638";
			document.getElementById("latitude").value = "35.23767968213337";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'ulsan':
			document.getElementById("longitude").value = "129.3114744963032";
			document.getElementById("latitude").value = "35.53894382583284";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'gwangju':
			document.getElementById("longitude").value = "126.85166293522462";
			document.getElementById("latitude").value = "35.16007495961763";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'gwangju':
			document.getElementById("longitude").value = "126.85166293522462";
			document.getElementById("latitude").value = "35.16007495961763";
			document.getElementById("altitude").value = "50000.0";
			break;
		case 'busan':
			document.getElementById("longitude").value = "129.128265";
			document.getElementById("latitude").value = "35.171834";
			document.getElementById("altitude").value = "10000.0";
			break;
		case 'jeju':
			document.getElementById("longitude").value = "126.49823771803996";
			document.getElementById("latitude").value = "33.488830032800486";
			document.getElementById("altitude").value = "50000.0";
			break;
	}
}

/* 카메라 위치 이동 */
function setCameraPosition() {

	if (GLOBAL.Camera == null) {
		return;
	}

	// 경위도, 고도 좌표 값 받아오기
	var longitude = parseFloat(document.getElementById("longitude").value);
	var latitude = parseFloat(document.getElementById("latitude").value);
	var altitude = parseFloat(document.getElementById("altitude").value);

	if (isNaN(longitude) || isNaN(latitude) || isNaN(altitude)) {
		return;
	}

	// 카메라 이동 실행
	GLOBAL.Camera.setTilt(45.0);
	GLOBAL.Camera.setLocation(new Module.JSVector3D(longitude, latitude, altitude));
}

/*********************************************************
 * 엔진 파일을 로드합니다.
 * 파일은 asm.js파일, html.mem파일, js 파일 순으로 적용합니다.
 *********************************************************/

; (function () {

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


