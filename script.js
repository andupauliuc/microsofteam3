$(document).ready(function(){
   	$('img.profilepic').mouseenter(function(){
  		$(this).fadeTo('slow', 0.25);  
  	});
  	$('img.profilepic').mouseleave(function () {
        $(this).fadeTo('slow', 1);
  	});



	var sentimentScore = 0.0001;
	var emotionScore = 0.0002;

	var sentimentResult = "";
	var emotionResult = "";

	var sentimentApiKey = "c5e50c011afb44b0b72cbde60bdd627c";
	var sentimentApiUrl = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment";

	var emotionApiKey = "cd1c7ad13e4b42cbbbc11d2e8010ac0c";
	var emotionApiUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";

	function CallAPI(inputData, apiUrl, apiKey, contentType, type) {
		$.ajax({	
			method: "POST",		
			url: apiUrl,
			beforeSend: function(xhrObj){
				xhrObj.setRequestHeader("Content-Type", contentType);
				xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
			},
			data: inputData,
			processData: false,
		})
		.done(processResult.bind(this, type))
		.fail(function (error) {
			console.log(JSON.stringify(error));
			return;
		});

	}

	function processResult(type, result) {
		if (type === "sentiment") {
			var score = result.documents[0].score;
			if (score > 0.5) {
				sentimentResult = "sentiment score: ";
			} else {
				sentimentResult = "sentiment score: ";
			}
			console.log(sentimentResult + score);
		} else {
			result = result[0];
			var negativeScore = result.scores.sadness;
			var positiveScore = result.scores.happiness;
			var neutralScore = result.scores.neutral;

			if (negativeScore > positiveScore) {
				emotionResult = "negative emotion. score: " + negativeScore;
			} else {
				emotionResult = "positive emotion. score: " + positiveScore;
			}
			console.log(emotionResult);
		}
	}

// sentiment analysis
	$("#submit-text").click(function() {
		var textSentimentInput = {
			"documents": [
				{
					"language": "en",
					"id": "1",
					"text": ""	
				}
			]
		};		
		textSentimentInput.documents[0].text = $("#input-text").val();
		if ($("#input-text").val() != "") {
			CallAPI(JSON.stringify(textSentimentInput), sentimentApiUrl, sentimentApiKey, "application/json", "sentiment");
		}
	})
// sentiment analysis


// image emotion analysis	
	$("#submit-image").click(function() {
		var file = document.getElementById('filename').files[0];
		if (file) {
			CallAPI(file, emotionApiUrl, emotionApiKey, "application/octet-stream", "emotion");
		}
	})
// image emotion analysis

// dual analysis
	$("#analyseButton").click(function() {
		var textInput = {
			"documents": [
				{
					"language": "en",
					"id": "1",
					"text": ""
				}
			]
		};
		textInput.documents[0].text = $("#textSentimentInput").val();
		var file = document.getElementById('filename').files[0];

		CallAPILive(JSON.stringify(textInput), sentimentApiUrl, sentimentApiKey, "application/json", "sentiment");
		CallAPILive(file, emotionApiUrl, emotionApiKey, "application/octet-stream", "emotion");

		// console.log(sentimentResult);
		// console.log(emotionResult);
	})

	function CallAPILive(inputData, apiUrl, apiKey, contentType, type) {
		$.ajax({	
			method: "POST",		
			url: apiUrl,
			beforeSend: function(xhrObj){
				xhrObj.setRequestHeader("Content-Type", contentType);
				xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
			},
			data: inputData,
			processData: false,
		})
		.done(processResultLive.bind(this, type))
		.fail(function (error) {
			console.log(JSON.stringify(error));
			return;
		});
	}	

	function processResultLive(type, result) {
		if (type === "sentiment") {
			var sentimentScore = result.documents[0].score;
			$("#scoreText").text(sentimentScore);
			// sentimentResult = "sentiment score: " + sentimentScore;
			// console.log(sentimentResult + score);
		} else {
			result = result[0];
			var negativeScore = result.scores.sadness;
			var positiveScore = result.scores.happiness;
			var neutralScore = result.scores.neutral;
			var score;

			if (negativeScore > positiveScore) {
				emotionResult = "negative emotion. score: " + negativeScore;
				score = negativeScore;
			} else {
				emotionResult = "positive emotion. score: " + positiveScore;
				score = positiveScore;
			}
			console.log(score);
			$("#scoreImg").text(score);

			// console.log(emotionResult);
		}
	}

	// console.log(sentimentResult);

// dual analysis

 });