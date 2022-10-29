//Fields
const hint_url = document
    .getElementsByClassName(hints_class)[0]
    .getAttribute("href")

const mainpage_id = "js-hook-game-wrapper";
const hints_class = "pz-toolbar-button pz-toolbar-button__hints";
const xPaths = {
    "list": "/html/body/div[1]/div/div/div[2]/main/div/article/section/div[4]/section/div/div/p[5]",
    "table": "/html/body/div[1]/div/div/div[2]/main/div/article/section/div[4]/section/div/div/table"
}
const letter_class_name = "cell-letter"
const letters = Array
    .from(document.getElementsByClassName(letter_class_name))
    .map(el => el.innerHTML);

let hints = {}
let wordlengths = []
fetch(hint_url)
    .then(function (response) {
        switch (response.status) {
            case 200:
                return response.text();
            case 404:
                alert(`Could not follow hints link ${hint_url}`);
        }
    })
    .then(function(html) {
        // Create new parser
        let parser = new DOMParser();
        // Parse the text
        let doc = parser.parseFromString(html, "text/html")
        //Select 2word-list
        let twowords = doc.evaluate(xPaths.list, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML
        //ol:1letter tl:2letter tot: total
        twowords.match(/\w\w-\d+/g).forEach(m => {
            fl = m[0]
            tl = m.slice(0, 2)
            tot = parseInt(m.slice(3))
            if (!(fl in hints)) hints[fl] = {}
            hints[fl][tl] = {
                total: tot,
                current: 0
            }
        });
        // Finding lengths of words        
        let table = doc.evaluate(xPaths.table, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        Array.from(
            table.lastChild.firstChild.children)
            .forEach((el) => {
                numornan = parseInt(el.innerHTML)
                if (numornan) wordlengths.push(numornan)
            })
        Array.from(table.lastChild.children)
            .slice(1) 
            .forEach((elements) => {
                let fels = Array.from(elements.children)
                    .filter(el => el.tagName == "TD" )
                    .map(el=>el.innerHTML)

                let letter = fels[0].match(/>(\w)</)

                if (letter !== null) { 
                    hints[letter[1]]["number_list"] = fels
                        .slice(1)
                        .map(el => parseInt(el) ? parseInt(el) : 0)
                }
            });
    });
