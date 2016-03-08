(function() {
    "use strict";

    var page = WinJS.UI.Pages.define("/index.html", {
        ready: function (element, options) {
                var defaultLang = Windows.Media.SpeechRecognition.SpeechRecognizer.systemSpeechLanguage;
                var rcns = Windows.ApplicationModel.Resources.Core;
                context = new rcns.ResourceContext();
                context.languages = new Array(defaultLang.languageTag);
                resourceMap = rcns.ResourceManager.current.mainResourceMap.getSubtree('LocalizationSpeechResources');
                initializeRecognizer(defaultLang);
                    
        },
        unload: function (element, options) {
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
        recognizer.constraints.append(
            Windows.Media.SpeechRecognition.SpeechRecognitionListConstraint([
                resourceMap.getValue('ListGrammarGoHome', context).valueAsString
            ], "GoHome"));
        recognizer.constraints.append(
            Windows.Media.SpeechRecognition.SpeechRecognitionListConstraint([
                resourceMap.getValue('ListGrammarShowWeather', context).valueAsString
            ], "ShowWeather"));
        recognizer.constraints.append(
            Windows.Media.SpeechRecognition.SpeechRecognitionListConstraint([
                resourceMap.getValue('DamnDaniel', context).valueAsString
            ], "DamnDaniel"));


        // RecognizeWithUIAsync allows developers to customize the prompts.
        var helpString = "Try saying '" +
            resourceMap.getValue('ListGrammarGoHome', context).valueAsString + "', '" +
            resourceMap.getValue('ListGrammarShowWeather', context).valueAsString + "' or '" +
    
        recognizer.compileConstraintsAsync().done(
            function (result) {
                // Check to make sure that the constraints were in a proper format and the recognizer was able to compile them.
                if (result.status != Windows.Media.SpeechRecognition.SpeechRecognitionResultStatus.success) {
                    // Let the user know that the grammar didn't compile properly.
                    speechRecognizerUnsuccessful(result.status);
                }
                else {
                   // ;
                }
            }
            );

        continuousRecoFn();
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

        console.log("SpeechRecognizer:: Continous Recognition starting.")        
        // Start the continuous recognition session. Results are handled in the event handlers below.
        try {
            recognizer.continuousRecognitionSession.startAsync().then(function completed() {
               console.log("SpeechRecognizer:: Continous Recognition started... Listening.")
            });
        }
        catch (e) {
            console.error("SpeechRecognizer:: could not start recognition: " + e.message);
         }
    }

    function onSpeechRecognizerResultGenerated(eventArgs) {
        /// <summary>
        /// Handle events fired when a result is generated. This may include a garbage rule that fires when general room noise
        /// or side-talk is captured (this will have a confidence of rejected typically, but may occasionally match a rule with
        /// low confidence).
        /// </summary>
        
        console.log("Speech Recognizer Results: " + eventArgs.result.constraint);
        
        
        // The garbage rule will not have a tag associated with it, the other rules will return a string matching the tag provided
        // when generating the grammar.
        var tag = "unknown";
        if (eventArgs.result.constraint != null) {
            tag = eventArgs.result.constraint.tag;
        }

        // Developers may decide to use per-phrase confidence levels in order to tune the behavior of their 
        // grammar based on testing.
        if (eventArgs.result.confidence == Windows.Media.SpeechRecognition.SpeechRecognitionConfidence.high ||
            eventArgs.result.confidence == Windows.Media.SpeechRecognition.SpeechRecognitionConfidence.medium) {

            amplify.publish("SpeechRecognized_High", tag);

         }
        else {
            amplify.publish("SpeechRecognized_Low", tag);
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

