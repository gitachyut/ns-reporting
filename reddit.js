const axios = require('axios');
var moment = require("moment");


const getRedditComments =  async (link) => new Promise(async (resolve, reject) => {
    let originalUrl = link;
    link = link.substring(0, link.length - 1); 
    link = `${link}.json`;
    results = [
        [ 'Item', 'Hot Link' ],
        [ 'Post Summary', 'Post Summary' ],
        [ 'Comment Summary', 'Comment Summary' ],
        [ 'Post Link', originalUrl, '' ],
        [ '' ],
        [ '' ],
        ['Sequence', 'Date', 'Comment','Relevancy', 'Sentiment']
    ];

    try {
        
        let res = await axios.get(link)
        let json = res.data
        var post = json[0].data.children[0].data;
    
        if (["", "default", "self", "nsfw"].indexOf(post.thumbnail) > -1) {
            post.thumbnail = undefined;
        }
    
        // humanize timestamp
        post.created_utc = moment.unix(post.created_utc).locale("en").fromNow();
    
        // replace 'likes' with 1,0 or -1 so that it's easy to use its value while rendering templates
        if (post.likes) {
            post.likes = 1;
        } else if (post.likes == null) {
            post.likes = 0;
        } else {
            post.likes = -1;
        }
    

        /**
         * Parse comments
         */
    
        var parseComments = function (thread, level) {
            if (thread.kind == "t1") {
                var comment = {body: thread.data.body,
                    score: thread.data.score,
                    likes: thread.data.likes,
                    author: thread.data.author,
                    name: thread.data.name,
                    created_utc: thread.data.created_utc,
                    level: level
                };
    
                // humanize timestamp
                comment.created_utc = moment.utc(moment.unix(comment.created_utc)).locale("en").fromNow();
    
                // replace 'likes' with 1,0 or -1 so that it's easy to use its value while rendering templates
                if (comment.likes) {
                    post.likes = 1;
                } else if (comment.likes == null) {
                    comment.likes = 0;
                } else {
                    comment.likes = -1;
                }
    
                let final = [
                    results.length - 7  + 1 ,  
                    comment.created_utc,
                    comment.body 
                ];
            
                results.push(final)

                if (thread.data.replies) {
                    level++;
                    thread.data.replies.data.children.forEach(function (thread) {
                        parseComments(thread, level);
                    });
                }
            }
        };



        json[1].data.children.forEach(function (thread,i) {
            parseComments(thread, 0);
            if( i+1 ==  json[1].data.children.length ){
                // none
            }else{
                // console.log(results)
                resolve(results)
                // csvWriter.writeRecords(results)       // returns a promise
                // .then(() => {
                //     console.log('...Done');
                // });
            }
        });

    } catch (error) {
        reject(error)
    }
   

}) 

// https://www.reddit.com/r/TwoXChromosomes/comments/kci3w8/chinese_characters_have_a_misogynistic_problem/
// https://www.reddit.com/r/singapore/comments/kcsjpy/i_notice_race_is_a_variable_involved_in_this/
// let link = 'https://www.reddit.com/r/singapore/comments/kcsjpy/i_notice_race_is_a_variable_involved_in_this/'
// getComments(link)

module.exports = {
    getRedditComments
}

