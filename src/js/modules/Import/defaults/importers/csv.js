function mapToColumns(rawData){
    var data = [];

    console.log("this", this)
    var columns = this.getColumns();

    //remove first row if it is the column names
    if(columns[0] && rawData[0][0]){
        if(columns[0].getDefinition().title === rawData[0][0]){
            rawData.shift();
        }
    }
    
    //convert row arrays to objects
    rawData.forEach((rowData) => {
        var row = {};

        rowData.forEach((value, index) => {
            var column = columns[index];

            if(column){
                row[column.getField()] = value;
            }
        })

        data.push(row);
    });

    return data;
}

function csvImporter(input){
    var data = [],
    row = 0, 
    col = 0,
    inQuote = false;
    
    //Itterate over each character
    for (let index = 0; index < input.length; index++) {
        let char = input[index], 
        nextChar = input[index+1];      
        
        //Initialize empty row
        if(!data[row]){
            data[row] = [];
        }

        //Initialize empty column
        if(!data[row][col]){
            data[row][col] = "";
        }
        
        //Handle quotation mark inside string
        if (char == '"' && inQuote && nextChar == '"') { 
            data[row][col] += char; 
            index++;
            continue; 
        }
        
        //Begin / End Quote
        if (char == '"') { 
            inQuote = !inQuote;
            continue;
        }
        
        //Next column (if not in quote)
        if (char == ',' && !inQuote) { 
            col++;
            continue; 
        }
        
        //New row if new line and not in quote (CRLF) 
        if (char == '\r' && nextChar == '\n' && !inQuote) { 
            col = 0; 
            row++; 
            index++; 
            continue; 
        }
        
        //New row if new line and not in quote (CR or LF) 
        if ((char == '\r' || char == '\n') && !inQuote) { 
            col = 0;
            row++;
            continue; 
        }

        //Normal Character, append to column
        data[row][col] += char;
    }

    return mapToColumns.call(this, data);
}

export default csvImporter;