var example = 'INF [20130701-14:27:01.063] stats: {"aaaa":8,"bbbb":17,"cccc":26,"dddd":39,"eeee":47,"ffff":59,"gggg":61,"hhhh":72,"iiii":85,"jjjj":93,"timestamp":0}';
var split = Raggiana.parseContents(example, 'INF');
var json = Raggiana.parseData(split);
var series = Raggiana.makeSeriesData(json);

describe("Reads files", function() {
  it("splits up data correctly", function () {
  	expect(split[0].data).toEqual({
  		aaaa:8,
  		bbbb:17,
  		cccc:26,
  		dddd:39,
  		eeee:47,
  		ffff:59,
  		gggg:61,
  		hhhh:72,
  		iiii:85,
  		jjjj:93,
  		timestamp:0
  	});
  });

  it("reads the data into json", function () {
	  expect(json.aaaa[0].y).toEqual(8);
    expect(json.bbbb[0].y).toEqual(17);
    expect(json.cccc[0].y).toEqual(26);
    expect(json.dddd[0].y).toEqual(39);
    expect(json.eeee[0].y).toEqual(47);
    expect(json.ffff[0].y).toEqual(59);
    expect(json.gggg[0].y).toEqual(61);
    expect(json.hhhh[0].y).toEqual(72);
    expect(json.iiii[0].y).toEqual(85);
    expect(json.jjjj[0].y).toEqual(93);
    expect(json.timestamp[0].y).toEqual(0);
  });
});

describe("Can graph the data", function() {
  it("serializes the data correctly", function () {
 	  expect(series[0]).toEqual({color: "#2f254a", data: [{x:0, y:8}], name: "aaaa"});
  });

  it("Takes json data and graphs it", function () {
    spyOn(Raggiana, 'doEverything');
    Raggiana.finalData = json;
    Raggiana.doEverything(Raggiana.finalData);
    expect(Raggiana.doEverything).toHaveBeenCalledWith(json);
  });
});