/** @jsx React.DOM */

var collection;

var Insights = React.createClass({
  getDefaultProps: function() {
    return {
      ages: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
      genders: ["Male", "Female"]
    }
  },

  getInitialState: function() {
    return {
      surveyData: [],
      drugList: [],
      incomeList: [],
      geographyList: [],
      urbanDensityList: [],
      genderSelected: "All",
      ageSelected: "All",
      drugSelected: "All",
      incomeSelected: "All",
      geographySelected: "All",
      urbanDensitySelected: "All",
    }
  },

  handleGenderSelect: function(gender) {
    console.log(gender);
    this.setState({genderSelected: gender});
  },

  handleAgeSelect: function(age) {
    console.log(age);
    this.setState({ageSelected: age});
  },

  onDrugSelect: function() {
    var drug = this.refs.drugSelect.getDOMNode().value;
    console.log(drug);
    this.setState({drugSelected: drug});
  },

  onIncomeSelect: function() {
    var income = this.refs.incomeSelect.getDOMNode().value;
    console.log(income);
    this.setState({incomeSelected: income});
  },

  onGeographySelect: function() {
    var geography = this.refs.geographySelect.getDOMNode().value;
    console.log(geography);
    this.setState({geographySelected: geography});
  },

  onUrbanDensitySelect: function() {
    var urbanDensity = this.refs.urbanDensitySelect.getDOMNode().value;
    console.log(urbanDensity);
    this.setState({urbanDensitySelected: urbanDensity});
  },

  renderWorkedChart: function() {
    collection = new PourOver.Collection(this.state.surveyData);
    var gender_filter = PourOver.makeExactFilter("gender", ["Male","Female"]);
    var age_filter = PourOver.makeExactFilter("age", ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]);
    var drug_filter = PourOver.makeExactFilter("name", this.state.drugList);
    var income_filter = PourOver.makeExactFilter("income", this.state.incomeList);
    var geography_filter = PourOver.makeExactFilter("geography", this.state.geographyList);
    var urbanDensity_filter = PourOver.makeExactFilter("urbanDensity", this.state.urbanDensityList);
    var worked_filter = PourOver.makeDVrangeFilter("worked_range",[1,2,3,4,5,6,7],{attr: "worked"})
    collection.addFilters([gender_filter, worked_filter, age_filter, drug_filter, income_filter, geography_filter, urbanDensity_filter]);

    var worked = [];
    for (var i = 0; i < 8; i++) {
      worked.push(collection.filters.worked_range.getFn([i,i]));
    }

    if (this.state.genderSelected == "All") {
        collection.filters.gender.query(["Male","Female"]);
    } else if (this.state.genderSelected == "Male") {
        collection.filters.gender.query("Male");
    } else if (this.state.genderSelected == "Female") {
        collection.filters.gender.query("Female");
    }

    var workedAge = [];
    if (this.state.ageSelected == "All") {
      collection.filters.age.query(["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]);
    } else if (this.state.ageSelected == "18-24") {
        collection.filters.age.query("18-24");
    } else if (this.state.ageSelected == "25-34") {
        collection.filters.age.query("25-34");
    } else if (this.state.ageSelected == "35-44") {
        collection.filters.age.query("35-44");
    } else if (this.state.ageSelected == "45-54") {
        collection.filters.age.query("45-54");
    } else if (this.state.ageSelected == "55-64") {
        collection.filters.age.query("55-64");
    } else if (this.state.ageSelected == "65+") {
        collection.filters.age.query("65+");
    }

    if (this.state.drugSelected == "All") {
      collection.filters.name.query(this.state.drugList);
    } else {
        collection.filters.name.query(this.state.drugSelected);
    }

    if (this.state.incomeSelected == "All") {
      collection.filters.income.query(this.state.incomeList);
    } else {
      collection.filters.income.query(this.state.incomeSelected);
    }

    if (this.state.geographySelected == "All") {
      collection.filters.geography.query(this.state.geographyList);
    } else {
      collection.filters.geography.query(this.state.geographySelected);
    }

    if (this.state.urbanDensitySelected == "All") {
      collection.filters.urbanDensity.query(this.state.urbanDensityList);
    } else {
      collection.filters.urbanDensity.query(this.state.urbanDensitySelected);
    }

    var dataTotal = [];
    dataTotal.push("Worked");
    for (var i = 1; i < worked.length; i++) {
      var ageSet = collection.filters.age.current_query;
      var genderSet = collection.filters.gender.current_query;
      var drugSet = collection.filters.name.current_query;
      var incomeSet = collection.filters.income.current_query;
      var geographySet = collection.filters.geography.current_query;
      var urbanDensitySet = collection.filters.urbanDensity.current_query;
      var outputSet = ageSet.and(genderSet);
      outputSet = outputSet.and(drugSet);
      outputSet = outputSet.and(incomeSet);
      outputSet = outputSet.and(geographySet);
      outputSet = outputSet.and(urbanDensitySet);
      outputSet = outputSet.and(worked[i]);
      var results = collection.get(outputSet.cids);
      dataTotal.push(results.length);
    }


    var chart = c3.generate({
      bindto: this.refs.workedchart.getDOMNode(),
      data: {
        columns: [dataTotal],
        type: "bar"
      },
      bar: {
        width: {
          ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
      },
      axis: {
        rotated: true,
        x: {
          tick: {
            format: function(d) {
              var tick = parseInt(d)+1;
              if(tick == 1){
                return "Didn't Work";
              } else if (tick == 7) {
                return "Worked Well";
              }
              return tick;
            }
          }
        },
        y: {
          label: {
            text: "Number of Responses",
            position: "outer-center"
          }
        }
      },
      legend: {
        show: false
      }
    });
  },

  renderHassleChart: function() {
    collection = new PourOver.Collection(this.state.surveyData);
    var gender_filter = PourOver.makeExactFilter("gender", ["Male","Female"]);
    var age_filter = PourOver.makeExactFilter("age", ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]);
    var drug_filter = PourOver.makeExactFilter("name", this.state.drugList);
    var income_filter = PourOver.makeExactFilter("income", this.state.incomeList);
    var geography_filter = PourOver.makeExactFilter("geography", this.state.geographyList);
    var urbanDensity_filter = PourOver.makeExactFilter("urbanDensity", this.state.urbanDensityList);
    var worked_filter = PourOver.makeDVrangeFilter("hassle_range",[1,2,3,4,5,6,7],{attr: "hassle"})
    collection.addFilters([gender_filter, worked_filter, age_filter, drug_filter, income_filter, geography_filter, urbanDensity_filter]);

    var worked = [];
    for (var i = 0; i < 8; i++) {
      worked.push(collection.filters.hassle_range.getFn([i,i]));
    }

    if (this.state.genderSelected == "All") {
        collection.filters.gender.query(["Male","Female"]);
    } else if (this.state.genderSelected == "Male") {
        collection.filters.gender.query("Male");
    } else if (this.state.genderSelected == "Female") {
        collection.filters.gender.query("Female");
    }

    var workedAge = [];
    if (this.state.ageSelected == "All") {
      collection.filters.age.query(["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]);
    } else if (this.state.ageSelected == "18-24") {
        collection.filters.age.query("18-24");
    } else if (this.state.ageSelected == "25-34") {
        collection.filters.age.query("25-34");
    } else if (this.state.ageSelected == "35-44") {
        collection.filters.age.query("35-44");
    } else if (this.state.ageSelected == "45-54") {
        collection.filters.age.query("45-54");
    } else if (this.state.ageSelected == "55-64") {
        collection.filters.age.query("55-64");
    } else if (this.state.ageSelected == "65+") {
        collection.filters.age.query("65+");
    }

    if (this.state.drugSelected == "All") {
      collection.filters.name.query(this.state.drugList);
    } else {
        collection.filters.name.query(this.state.drugSelected);
    }

    if (this.state.incomeSelected == "All") {
      collection.filters.income.query(this.state.incomeList);
    } else {
      collection.filters.income.query(this.state.incomeSelected);
    }

    if (this.state.geographySelected == "All") {
      collection.filters.geography.query(this.state.geographyList);
    } else {
      collection.filters.geography.query(this.state.geographySelected);
    }

    if (this.state.urbanDensitySelected == "All") {
      collection.filters.urbanDensity.query(this.state.urbanDensityList);
    } else {
      collection.filters.urbanDensity.query(this.state.urbanDensitySelected);
    }

    var dataTotal = [];
    dataTotal.push("Hassle");
    for (var i = 1; i < worked.length; i++) {
      var ageSet = collection.filters.age.current_query;
      var genderSet = collection.filters.gender.current_query;
      var drugSet = collection.filters.name.current_query;
      var incomeSet = collection.filters.income.current_query;
      var geographySet = collection.filters.geography.current_query;
      var urbanDensitySet = collection.filters.urbanDensity.current_query;
      var outputSet = ageSet.and(genderSet);
      outputSet = outputSet.and(drugSet);
      outputSet = outputSet.and(incomeSet);
      outputSet = outputSet.and(geographySet);
      outputSet = outputSet.and(urbanDensitySet);
      outputSet = outputSet.and(worked[i]);
      var results = collection.get(outputSet.cids);
      dataTotal.push(results.length);
    }

    var chart = c3.generate({
      bindto: this.refs.hasslechart.getDOMNode(),
      data: {
        columns: [dataTotal],
        type: "bar"
      },
      bar: {
        width: {
          ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
      },
      axis: {
        rotated: true,
        x: {
          tick: {
            format: function(d) {
              var tick = parseInt(d)+1;
              if(tick == 1){
                return "No Hassle";
              } else if (tick == 7) {
                return "Huge Hassle";
              }
              return tick;
            }
          }
        },
        y: {
          label: {
            text:"Number of Responses",
            position: "outer-center"
          }
        }
      },
      legend: {
        show: false
      },
    });
  },

  renderWorthChart: function() {
    collection = new PourOver.Collection(this.state.surveyData);
    var gender_filter = PourOver.makeExactFilter("gender", ["Male","Female"]);
    var age_filter = PourOver.makeExactFilter("age", ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]);
    var drug_filter = PourOver.makeExactFilter("name", this.state.drugList);
    var income_filter = PourOver.makeExactFilter("income", this.state.incomeList);
    var geography_filter = PourOver.makeExactFilter("geography", this.state.geographyList);
    var urbanDensity_filter = PourOver.makeExactFilter("urbanDensity", this.state.urbanDensityList);
    var worked_filter = PourOver.makeExactFilter("worth",["Worth it", "Don't know/not sure", "Not worth it"]);
    collection.addFilters([gender_filter, worked_filter, age_filter, drug_filter, income_filter, geography_filter, urbanDensity_filter]);

    var worked = [];

    worked.push(collection.filters.worth.getFn("Worth it"));
    worked.push(collection.filters.worth.getFn("Don't know/not sure"));
    worked.push(collection.filters.worth.getFn("Not worth it"));

    if (this.state.genderSelected == "All") {
        collection.filters.gender.query(["Male","Female"]);
    } else if (this.state.genderSelected == "Male") {
        collection.filters.gender.query("Male");
    } else if (this.state.genderSelected == "Female") {
        collection.filters.gender.query("Female");
    }

    var workedAge = [];
    if (this.state.ageSelected == "All") {
      collection.filters.age.query(["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]);
    } else if (this.state.ageSelected == "18-24") {
        collection.filters.age.query("18-24");
    } else if (this.state.ageSelected == "25-34") {
        collection.filters.age.query("25-34");
    } else if (this.state.ageSelected == "35-44") {
        collection.filters.age.query("35-44");
    } else if (this.state.ageSelected == "45-54") {
        collection.filters.age.query("45-54");
    } else if (this.state.ageSelected == "55-64") {
        collection.filters.age.query("55-64");
    } else if (this.state.ageSelected == "65+") {
        collection.filters.age.query("65+");
    }

    if (this.state.drugSelected == "All") {
      collection.filters.name.query(this.state.drugList);
    } else {
        collection.filters.name.query(this.state.drugSelected);
    }

    if (this.state.incomeSelected == "All") {
      collection.filters.income.query(this.state.incomeList);
    } else {
      collection.filters.income.query(this.state.incomeSelected);
    }

    if (this.state.geographySelected == "All") {
      collection.filters.geography.query(this.state.geographyList);
    } else {
      collection.filters.geography.query(this.state.geographySelected);
    }

    if (this.state.incomeSelected == "All") {
      collection.filters.income.query(this.state.incomeList);
    } else {
      collection.filters.income.query(this.state.incomeSelected);
    }

    var dataTotal = [];
    dataTotal.push("Worth");
    for (var i = 0; i < worked.length; i++) {
      var ageSet = collection.filters.age.current_query;
      var genderSet = collection.filters.gender.current_query;
      var drugSet = collection.filters.name.current_query;
      var incomeSet = collection.filters.income.current_query;
      var geographySet = collection.filters.geography.current_query;
      var urbanDensitySet = collection.filters.urbanDensity.current_query;
      var outputSet = ageSet.and(genderSet);
      outputSet = outputSet.and(drugSet);
      outputSet = outputSet.and(incomeSet);
      outputSet = outputSet.and(geographySet);
      outputSet = outputSet.and(urbanDensitySet);
      outputSet = outputSet.and(worked[i]);
      var results = collection.get(outputSet.cids);
      dataTotal.push(results.length);
    }


    var chart = c3.generate({
      bindto: this.refs.worthchart.getDOMNode(),
      data: {
        columns: [dataTotal],
        type: "bar"
      },
      bar: {
        width: {
          ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
      },
      axis: {
        rotated: true,
        x: {
          tick: {
            format: function(d) {
              var tick = parseInt(d)+1;
              if(tick == 1){
                return "Not worth it";
              } else if (tick == 2) {
                return "Don't know/not sure";
              } else if (tick == 3) {
                return "Not worth it";
              }
              return tick;
            }
          }
        },
        y: {
          label: {
            text: "Number of Responses",
            position: "outer-center"
          }

        }
      },
      legend: {
        show: false
      }
    });
  },

  render: function() {
    return (
      <div>
        <div className="controlMenu">
          <h3>Control Menu</h3>
          <div className="filter">
            <h4>Gender</h4>
            <div className="btn-group" data-toggle="buttons">
                  {this.renderGenderButtonGroup()}
            </div>
          </div>
          <div className="filter">
            <h4>Age</h4>
            <div className="btn-group" data-toggle="buttons">
                  {this.renderAgeButtonGroup()}
            </div>
          </div>

          <div className="filter">
            <h4>Drug</h4>
            <select className="form-control" ref="drugSelect" onChange={this.onDrugSelect}>
              {this.renderDropdown(this.state.drugList)}
            </select>
          </div>

          <div className="filter">
            <h4>Income</h4>
            <select className="form-control" ref="incomeSelect" onChange={this.onIncomeSelect}>
              {this.renderDropdown(this.state.incomeList)}
            </select>
          </div>

          <div className="filter">
            <h4>Geography</h4>
            <select className="form-control" ref="geographySelect" onChange={this.onGeographySelect}>
              {this.renderDropdown(this.state.geographyList)}
            </select>
          </div>

          <div className="filter">
            <h4>Urban Density</h4>
            <select className="form-control" ref="urbanDensitySelect" onChange={this.onUrbanDensitySelect}>
              {this.renderDropdown(this.state.urbanDensityList)}
            </select>
          </div>

        </div>

        <div className="charts">

          <h3>Worked</h3>
          <div ref="workedchart">
          </div>

          <h3>Hassle</h3>
          <div ref="hasslechart">
          </div>

          <h3>Worth</h3>
          <div ref="worthchart">
          </div>
        </div>

      </div>
    );
  },

  renderAgeButtonGroup: function() {
    var ageButtonGroup = [];

    ageButtonGroup.push(
      <label className="btn btn-default active" key={"All"} onClick={this.handleAgeSelect.bind(this, "All")} >
        <input type="radio" name="age" value={"All"} onClick={this.handleAgeSelect.bind(this, "All")} />
          {"All"}
      </label>
    );
    for(var i = 0; i < this.props.ages.length; i++) {
      var age = this.props.ages[i];


        ageButtonGroup.push(
          <label className="btn btn-default" key={age} onClick={this.handleAgeSelect.bind(this, age)}>
            <input type="radio" name="age" value={age} onClick={this.handleAgeSelect.bind(this, age)}/>
              {age}
          </label>
        );

    }

    return ageButtonGroup;
  },

  renderGenderButtonGroup: function() {
    var genderButtonGroup = [];

    genderButtonGroup.push(
      <label className="btn btn-default active" key={"All"} onClick={this.handleGenderSelect.bind(this, "All")} >
        <input type="radio" name="gender" value={"All"} onClick={this.handleGenderSelect.bind(this, "All")} />
          {"All"}
      </label>
    );
    for(var i = 0; i < this.props.genders.length; i++) {
      var gender = this.props.genders[i];

        genderButtonGroup.push(
          <label className="btn btn-default" key={gender} onClick={this.handleGenderSelect.bind(this, gender)} >
            <input type="radio" name="age" value={gender} onClick={this.handleGenderSelect.bind(this, gender)} />
              {gender}
          </label>
        );

    }

    return genderButtonGroup;
  },

  renderDropdown: function(list) {
    var dropdown = [];

    dropdown.push(
      <option key="All">
      {"All"}
      </option>
    );
    for(var i = 0; i < list.length; i++) {
      var item = list[i];

        dropdown.push(
          <option key={item}>
          {item}
          </option>
        );

    }

    return dropdown;
  },


  componentWillMount: function() {
  },

  componentDidMount: function() {
    $.getJSON("/surveyData", function(json) {
        this.setState({surveyData: json["survey_data"]});
        var drugNames = {};
        var incomes = {};
        var geographies = {};
        var urbanDensities = {};
        for(var i = 0; i < json["survey_data"].length; i++) {
          drugNames[json["survey_data"][i].name] = true;
          incomes[json["survey_data"][i].income] = true;
          geographies[json["survey_data"][i].geography] = true;
          urbanDensities[json["survey_data"][i].urbanDensity] = true;
        }
        var drugList = [];
        var incomeList = [];
        var geographyList = [];
        var urbanDensityList = [];
        for(var key in drugNames) {
          drugList.push(key);
        }
        for(var key in incomes) {
          incomeList.push(key);
        }
        for(var key in geographies) {
          geographyList.push(key);
        }
        for(var key in urbanDensities) {
          urbanDensityList.push(key);
        }
        var pattern = /[,][$][-][\+]/g
        incomeList.sort(function (a,b){
          a = a.replace(pattern,'');
          b = b.replace(pattern,'');

          var regexAlphabet = /[^a-zA-Z]/g;
          var regexDigits = /[^0-9]/g;

          var aDigits = a.replace(regexAlphabet, "");
          var bDigits = b.replace(regexAlphabet, "");

          if (aDigits === bDigits) {
            var aLetters = parseInt(a.replace(regexDigits, ""), 10);
            var bLetters = parseInt(b.replace(regexDigits, ""), 10);
            return aLetters === bLetters ? 0 : aLetters > bLetters ? 1 : -1;
          } else {
            return aDigits > bDigits ? 1 : -1;
          }

        });

        geographyList.sort();
        urbanDensityList.sort();
        this.setState({drugList: drugList});
        this.setState({incomeList: incomeList});
        this.setState({geographyList: geographyList});
        this.setState({urbanDensityList: urbanDensityList});
    }.bind(this))
  },

  componentDidUpdate: function() {

    if(this.state.drugList.length != 0 && this.state.incomeList.length != 0
      && this.state.geographyList.length != 0
      && this.state.urbanDensityList.length != 0){
      console.log("render");
      this.renderWorkedChart();
      this.renderHassleChart();
      this.renderWorthChart();
    }
  }
});


React.renderComponent(
  <Insights />,
  document.getElementById("example")
);
