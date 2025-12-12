import {google} from "@ai-sdk/google";
import {streamText} from "ai"
import { config } from "../../config/google.config.js"
import chalk from "chalk";





export class AIService{
    constructor(){
        if(!config.googleApiKey){
            throw new Error("Google API key is not configured. Please set the GOOGLE_API_KEY environment variable.");

        }
        this.model = google(config.model,{
            apiKey:config.googleApiKey,
        })
        }



        /**
         * send a  message and get streaming responser
         * @param {Array} messages
         * @param {Function} onChunk
         * @param {Object} onToolCall
         * @retrun {Promise<Object>}
         */

        async sendMessage(messages, onChunk , tools= undefined, onToolCall = null){
            try{
                const streamConfig = {
                    model:this.model,
                    messages:messages,
                }
                const result = streamText(streamConfig);

                let fullResponse = "";

                for await (const chunk of result.textStream){
                    fullResponse += chunk;
                    if(onChunk){
                        onChunk(chunk)
                    }
                }
            
                const fullResult = result;
            return{
                fullResponse,
            finishResponse:fullResult.finishReason,
            usage:fullResult.usage
            }
            } catch(error){
            console.error(chalk.red("AI Service Error:"),error.message);
            throw error;
            }
        }
        /**
         * Get a non-streaming response
         * @param {Array} messages - Array of message objects
         * @param {Object} tools - Optional tools for the model
         * @returns {Promise<Object>} - Full response object
         */

        async getMessage(messages, tools= undefined){
            let fullResponse = "";
            await this.sendMessage(messages, (chunk) =>{
                fullResponse += chunk;
            })
            return fullResponse
    } 
}
