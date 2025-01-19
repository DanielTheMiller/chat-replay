chatInputBox = document.getElementById("input_line");
chat_list = document.getElementById("chat_list");
chat_zone = document.getElementById("chat_zone");


const magic_8_ball_lines = ["It is certain", "Reply hazy, try again", "Don’t count on it", "It is decidedly so", "Ask again later",
"My reply is no", "Without a doubt", "Better not tell you now", "My sources say no", "Yes definitely", "Cannot predict now", "Outlook not so good",
"You may rely on it", "Concentrate and ask again", "Very doubtful", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes"];

chat_history = [];

chatInputBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        // Consume current content of the chat field
        let insertedText = chatInputBox.value;
        console.log(insertedText)
        // Clear input
        chatInputBox.value = "";
        // Add to the chat history array
        chat_history.push(insertedText);
        // Insert a new chat bubble
        addChat("guest", insertedText, "00:00");
        random_magic_8_ball_reply();
    }
});

function addChat(actor, text, time)
{
    let new_list_item = document.createElement("li");
    new_list_item.innerText = text;
    new_list_item.className = "chat " + actor;
    chat_list.appendChild(new_list_item);
    // Scroll the chat window down
    chat_zone.scrollTop = chat_zone.scrollHeight;
}

function introduction()
{
    addChat("host", "Welcome to Chat Replay!", "00:00");
    setTimeout(() => addChat("host", "I am wise Lily. I know all", "00:00"), 1000);
    setTimeout(() => addChat("host", "Fortunes... futures...", "00:00"), 3000);
    setTimeout(() => addChat("host", "And everything in-between!", "00:00"), 5000);
    setTimeout(() => addChat("host", "Ask me any yes or no question", "00:00"), 7000);
    // host_lines.forEach((v, index) =>  { setTimeout(() => addChat("host", v, "00:00"), 4000 * index+1 )});
}

function random_magic_8_ball_reply()
{
    let response_index= Math.floor(Math.random() * magic_8_ball_lines.length);
    let random_response = magic_8_ball_lines[response_index];
    setTimeout(() => addChat("host", random_response, "00:00"), 1000 )   
}

introduction();