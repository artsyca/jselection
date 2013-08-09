test("Initialize the widget", function() {
	var $fixture = $("#qunit-fixture");

	$fixture.append($("#prototypes div.textarea").clone());

	$textarea = $("> div", $fixture)

	$textarea.jselection({});

	ok(typeof($textarea.data("ui-jselection").words) !== "undefined", "Word data present");
	ok(typeof($textarea.data("ui-jselection").html) !== "undefined", "HTML data present");

});

test("Simulate text selection", function() {
	var $fixture = $("#qunit-fixture");

	$fixture.append($("#prototypes div.textarea").clone());

	$textarea = $("> div", $fixture);

	$textarea.jselection({});


	var words = $textarea.data("ui-jselection").words;

	// http://roshanbh.com.np/2008/09/get-random-number-range-two-numbers-javascript.html
	function randomXToY(minVal, maxVal, floatVal) {
		var randVal = minVal + (Math.random() * (maxVal - minVal));
		return typeof floatVal == 'undefined' ? Math.round(randVal) : randVal.toFixed(floatVal);
	}

	var selection = words.slice (randomXToY(0, words.length/2), words.length/2 + 1, words.length).addClass("selected");

	alert($textarea.jselection("selection"))

	ok ($textarea.jselection("selection").length == selection.length, "Selection successful");


});