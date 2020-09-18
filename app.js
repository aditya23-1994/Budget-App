// Budget controller
var budgetController = (function() {

    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        data.total[type] = sum;
    };

    var data = {
        allItems:  {
            exp: [],
            inc: []
        },
        total: {
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    }

    return {
        addItem: function(type,des,val) {
            var newItem,ID;
            // Pass the id for the  product
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            }else {
                ID = 0;
            }

            // add the item into the data-structure basd on there types
            if(type === 'exp' ) {
               newItem = new Expense(ID, des, val);

            }else if (type === 'inc') {
                newItem = new Income(ID,des,val);
            }
            // append the value into the data-structure!           
            data.allItems[type].push(newItem);
            // return the new element.
            return newItem;
        },

        calculateBudget: function(){
            // Calculate total income & expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // Calculate the budget which is income nd expenses
            data.budget = data.total.inc - data.total.exp
            // Calculate the percentage of income that is spended.
            data.percentage = Math.round((data.total.exp / data.total.inc) * 100)
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percerentage: data.percentage 
            };
        },

        testing: function(){
            console.log(data);
        }
    
    }

})();
// UI controller
var UIController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    return{
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj,type) {
            var html, newHtml;
            // Create HTML starting with PlaceHolder text!
            
            if(type === 'inc') {
                element = DOMstrings.incomeContainer;    
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
            }else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">-%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholder text with some actual data

            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            // Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },

        clearFields: function(){
            var fields,fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' +
            DOMstrings.inputValue );

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current,index,array) {
                current.value ="";                 
            });

            fieldsArr[0].focus();
        },

        getDomStrings: function() {
            return DOMstrings;
        
        }
     };
})();


// Global controller
var controller = (function(budgetCtrl, UICtrl){



    var setupEventListner = function(){
        var DOM = UICtrl.getDomStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

    };

    var updateBudget = function() {

        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();

        console.log(budget);
    };

    var ctrlAddItem = function() {
        var input, newItem;
         // 1. Get the field input data.
        input = UICtrl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){ 
        // 2.Add the item to the budget controller.
        newItem = budgetCtrl.addItem(input.type, input.description,input.value);

        // 3. Add the item to the UI.
        UICtrl.addListItem(newItem, input.type)
        UICtrl.clearFields();
        // 4. Calculate the budget.

        // 5. Display the budget on the UI.
    }
    };

    return{
        init: function(){
            console.log("App has started");
            setupEventListner();

        }
    }

    
})(budgetController,UIController);


controller.init();







