(function() {
    "use strict";

    var page = WinJS.UI.Pages.define("/index.html", {
        ready: function(element, options) {
            var defaultLang = Windows.Media.SpeechRecognition.SpeechRecognizer.systemSpeechLanguage;
            var rcns = Windows.ApplicationModel.Resources.Core;
            context = new rcns.ResourceContext();
            context.languages = new Array(defaultLang.languageTag);
            console.log("Language:" + defaultLang.languageTag)
            resourceMap = rcns.ResourceManager.current.mainResourceMap.getSubtree('LocalizationSpeechResources');
            initializeRecognizer(defaultLang);

        },
        unload: function(element, options) {
            if (recognizer != null) {
                recognizer.removeEventListener('statechanged', onSpeechRecognizerStateChanged, false);
                recognizer.close();
            }
        }
    });

    var recognizer;
    // localization resources
    var context;
    var resourceMap;


    function initializeRecognizer(language) {
        /// <summary>
        /// Initialize speech recognizer and compile constraints.
        /// </summary>
        if (typeof recognizer !== 'undefined') {
            recognizer = null;
        }
        recognizer = Windows.Media.SpeechRecognition.SpeechRecognizer(language);

        // Provide feedback to the user about the state of the recognizer.
        recognizer.addEventListener('statechanged', onSpeechRecognizerStateChanged, false);
        // Handle continuous recognition events. Completed fires when various error states occur or the session otherwise ends.
        // ResultGenerated fires when recognized phrases are spoken or the garbage rule is hit.
        recognizer.continuousRecognitionSession.addEventListener('resultgenerated', onSpeechRecognizerResultGenerated, false);
        recognizer.continuousRecognitionSession.addEventListener('completed', onSpeechRecognizerSessionCompleted, false);

        // Build a command-list grammar. Multiple commands can be given the same tag, allowing for variations on the same command to be handled easily.
        /*        recognizer.constraints.append(
                    Windows.Media.SpeechRecognition.SpeechRecognitionListConstraint([
                        resourceMap.getValue('ListGrammarGoHome', context).valueAsString
                    ], "GoHome"));
                recognizer.constraints.append(
                    Windows.Media.SpeechRecognition.SpeechRecognitionListConstraint([
                        resourceMap.getValue('DamnDaniel', context).valueAsString
                    ], "DamnDaniel"));
        */

        // Specify the location of your grammar file, then retrieve it as a StorageFile.
        var grammarFilePath = "SpeechGrammer\\" + language.languageTag + "\\SRGS_grammar.xml";

        Windows.ApplicationModel.Package.current.installedLocation.getFileAsync(grammarFilePath).done(
            function(result) {
                var fileConstraint = new Windows.Media.SpeechRecognition.SpeechRecognitionGrammarFileConstraint(result, "colors");
                recognizer.constraints.append(fileConstraint);

                recognizer.compileConstraintsAsync().done(
                    function(result) {
                        // Check to make sure that the constraints were in a proper format and the recognizer was able to compile them.
                        if (result.status != Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.success) {
                            // Let the user know that the grammar didn't compile properly.
                            speechRecognizerUnsuccessful(result.status);
                            console.error("Compilation Error");
                        }
                        else {
                            console.log("Compilation Complete");
                            continuousRecoFn();
                        }
                    }
                );
            }
        );


        /*        
                recognizer.compileConstraintsAsync().done(
                    function(result) {
                        // Check to make sure that the constraints were in a proper format and the recognizer was able to compile them.
                        if (result.status != Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.success) {
                            // Let the user know that the grammar didn't compile properly.
                            speechRecognizerUnsuccessful(result.status);
                            console.error("Compilation Error");
                        }
                        else {
                            console.log("Compilation Complete");
                            continuousRecoFn();
                        }
                    }
                );
        */

    }


    function continuousRecoFn() {
        /// <summary>
        /// Begin recognition or finish the recognition session.
        /// </summary>


        if (recognizer.state != Windows.Media.SpeechRecognition.SpeechRecognizerState.idle) { // Check if the recognizer is listening or going into a state to listen.
            console.log("SpeechRecognizer:: Continous Recognition is Idle, attempting to stop Async.")
            recognizer.continuousRecognitionSession.stopAsync();
            return;
        }

        // Start the continuous recognition session. Results are handled in the event handlers below.
        try {
            recognizer.continuousRecognitionSession.startAsync().then(function completed() {
                console.log("SpeechRecognizer:: Continous Recognition started... Listening.")
                amplify.publish("SpeechStateChanged", "Started")
            });
        }
        catch (e) {
            console.error("SpeechRecognizer:: could not start recognition: " + e.message);
            amplify.publish("SpeechUnsuccessful", "FailedToStart");
        }
    }

    function onSpeechRecognizerResultGenerated(eventArgs) {
        /// <summary>
        /// Handle events fired when a result is generated. This may include a garbage rule that fires when general room noise
        /// or side-talk is captured (this will have a confidence of rejected typically, but may occasionally match a rule with
        /// low confidence).
        /// </summary>

        console.log("Speech Recognizer Results: " + eventArgs.result);

        var result = eventArgs.result;

        // The garbage rule will not have a tag associated with it, the other rules will return a string matching the tag provided
        // when generating the grammar.
        
        var garbagePrompt = "";
        var resultText;

        // Developers may decide to use per-phrase confidence levels in order to tune the behavior of their 
        // grammar based on testing.
        if (eventArgs.result.confidence == Windows.Media.SpeechRecognition.SpeechRecognitionConfidence.high ||
            eventArgs.result.confidence == Windows.Media.SpeechRecognition.SpeechRecognitionConfidence.medium) {

            var semanticsObj = new Object(result.semanticInterpretation);

         // BACKGROUND: Check to see if the recognition result contains the semantic key for the background color,
            // and not a match for the GARBAGE rule, and change the color.
            if ("background" in semanticsObj.properties && semanticsObj.properties["background"].toString() != "...") {
                resultText = semanticsObj.properties["background"].toString();
            }

            // If "background" was matched, but the color rule matched GARBAGE, prompt the user.
            else if ("background" in semanticsObj.properties && semanticsObj.properties["background"].toString() == "...") {

                garbagePrompt += "Didn't get the background color \n\nTry saying blue background\n";

            }

            // BORDER: Check to see if the recognition result contains the semantic key for the border color,
            // and not a match for the GARBAGE rule, and change the color.
            if ("border" in semanticsObj.properties && semanticsObj.properties["border"].toString() != "...") {
                resultText  = semanticsObj.properties["border"].toString();
         
            }

            // If "border" was matched, but the color rule matched GARBAGE, prompt the user.
            else if ("border" in semanticsObj.properties && semanticsObj.properties["border"].toString() == "...") {
                garbagePrompt += "Didn't get the border color\n\n Try saying red border\n";
          
            }

            // CIRCLE: Check to see if the recognition result contains the semantic key for the circle color,
            // and not a match for the GARBAGE rule, and change the color.
            if ("circle" in semanticsObj.properties && semanticsObj.properties["circle"].toString() != "...") {
                resultText = semanticsObj.properties["circle"].toString();
              
            }

            // If "circle" was matched, but the color rule matched GARBAGE, prompt the user.
            else if ("circle" in semanticsObj.properties && semanticsObj.properties["circle"].toString() == "...") {
                garbagePrompt += "Didn't get the circle color\n\n Try saying green circle\n";
                
            }

            // Initialize a string that will describe the user's color choices.
            


            amplify.publish("SpeechRecognized_High", resultText);

        }
        else {
            amplify.publish("SpeechRecognized_Low", "didnt catch that");
            console.debug("sorry I didnt catch that");
        }
    }

    function onSpeechRecognizerSessionCompleted(eventArgs) {
        /// <summary>
        /// Handle events fired when error conditions occur, such as the microphone becoming unavailable, or if
        /// some transient issues occur. This also fires when the session completes normally.
        /// </summary>
        if (eventArgs.status != Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.success) {
            speechRecognizerUnsuccessful(eventArgs.status);
        }
    }

    function onSpeechRecognizerStateChanged(eventArgs) {
        /// <summary>
        /// Looks up the state text and displays the message to the user.
        /// </summary>

        console.log("Speech Recognizer State Changed: " + eventArgs);

        switch (eventArgs.state) {
            case Windows.Media.SpeechRecognition.SpeechRecognizerState.idle: {
                amplify.publish("SpeechStateChanged", "idle");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognizerState.capturing: {

                amplify.publish("SpeechStateChanged", "capturing");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognizerState.processing: {
                amplify.publish("SpeechStateChanged", "processing");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognizerState.soundStarted: {
                amplify.publish("SpeechStateChanged", "soundStarted");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognizerState.soundEnded: {
                amplify.publish("SpeechStateChanged", "soundEnded");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognizerState.speechDetected: {
                amplify.publish("SpeechStateChanged", "speechDetected");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognizerState.paused: {
                amplify.publish("SpeechStateChanged", "paused");
                break;
            }
            default: {
                break;
            }
        }
    }

    function speechRecognizerUnsuccessful(resultStatus) {
        /// <summary>
        /// Looks up the error text and displays the message to the user.
        /// </summary>
        console.debug("speechRecognizer Unsuccessful: " + resultStatus);

        switch (resultStatus) {
            case Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.audioQualityFailure: {
                amplify.publish("SpeechUnsuccessful", "audioQualityFailure");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.grammarCompilationFailure: {
                amplify.publish("SpeechUnsuccessful", "grammarCompilationFailure");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.grammarLanguageMismatch: {
                amplify.publish("SpeechUnsuccessful", "grammarLanguageMismatch");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.microphoneUnavailable: {
                amplify.publish("SpeechUnsuccessful", "microphoneUnavailable");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.networkFailure: {
                amplify.publish("SpeechUnsuccessful", "networkFailure");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.pauseLimitExceeded: {
                amplify.publish("SpeechUnsuccessful", "pauseLimitExceeded");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.timeoutExceeded: {
                amplify.publish("SpeechUnsuccessful", "timeoutExceeded");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.topicLanguageNotSupported: {
                amplify.publish("SpeechUnsuccessful", "topicLanguageNotSupported");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.unknown: {
                amplify.publish("SpeechUnsuccessful", "unknown");
                break;
            }
            case Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.userCanceled: {
                amplify.publish("SpeechUnsuccessful", "userCanceled");
                break;
            }
            default: {
                break;
            }
        }
    }

    function convertConfidenceToString(confidence) {
        /// <summary> Converts numeric confidence value into text representation of
        /// Windows.Media.SpeechRecognition.SpeechRecognitionConfidence for visualization.
        /// <param name="confidence">The numeric confidence returned by SpeechRecognitionResult.Confidence</param>
        /// </summary>

        switch (confidence) {
            case Windows.Media.SpeechRecognition.SpeechRecognitionConfidence.high: {
                return "high";
            }
            case Windows.Media.SpeechRecognition.SpeechRecognitionConfidence.medium: {
                return "medium";
            }
            case Windows.Media.SpeechRecognition.SpeechRecognitionConfidence.low: {
                return "low";
            }
            case Windows.Media.SpeechRecognition.SpeechRecognitionConfidence.rejected: {
                return "rejected";
            }
            default:
                return "unknown";
        }
    }
})();

