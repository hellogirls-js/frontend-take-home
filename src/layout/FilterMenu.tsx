import { useEffect, useState } from "react";
import Select from "../components/utility/Select";
import { IconX } from "@tabler/icons-react";
import TextInput from "../components/utility/TextInput";
import ErrorAlert from "../components/utility/ErrorAlert";
import Button from "../components/utility/Button";

function Accordion({ title, children }: { title: string; children?: any; }) {
  return (
    <div className="accordion">
      <div className="accordion-title">
        <div className="accordion-title-name">{title}</div>
        <div className="accordion-title-arrow"></div>
      </div>
      <div className="accordion-content">
        {children}
      </div>
    </div>
  )
}

function FilterPill({ children, data, changeData }: {children: string, data: any[]; changeData: any; }) {
  /**
   * 
   * @param {any[]} arr the array to remove an element from
   * @param {any} value the value to remove from the array
   * @returns {any[]} an array with the desired value removed from it
   */
  
  return (
    <div className="filter-pill breed">
      <div className="filter-pill-text">
        {children}
      </div>
      <div className="filter-pill-x" onClick={(e) => {
        let newData = data.filter(a => a !== children);
        changeData(newData);
      }}>
        <IconX size={18} />
      </div>
    </div>
  )
}

export default function FilterMenu(
  { 
    breedData, 
    onBreedChange, 
    currentBreeds, 
    onZipcodeChange,
    currentZipcodes,
    onAgeMinChange,
    onAgeMaxChange,
    currentAgeMin,
    currentAgeMax 
  }: 
  { 
    breedData: string[]; 
    onBreedChange: any; 
    currentBreeds: string[];
    onZipcodeChange: any;
    currentZipcodes: string[];
    onAgeMinChange: any;
    onAgeMaxChange: any;
    currentAgeMin?: number;
    currentAgeMax?: number;
  }
) {
  const [breedSelect, setBreedSelect] = useState<string>();

  useEffect(() => {
    if (breedSelect !== undefined) {
      onBreedChange([...currentBreeds, breedSelect]);
    }
  }, [breedSelect]);

  function BreedFilter() {
    return (
      <div className="filter-option">
        <Select 
          id="select-breed" 
          label="Breed" 
          data={breedData.map((breed) => { return { value: breed, label: breed } })} 
          onChange={setBreedSelect} 
          placeholder="Select breed..." 
        />
        <div id="selected-breeds">
          {currentBreeds.map((breed) => <FilterPill key={breed} data={currentBreeds} changeData={onBreedChange}>{breed}</FilterPill>)}
        </div>
      </div>
    ) 
  }

  function ZipcodeFilter() {
    const [error, setError] = useState<string>();
    return (
      <div className="filter-option">
        <form onSubmit={(e) => {
          e.preventDefault();
          const zipInput: HTMLInputElement = document.getElementById("zipcode") as HTMLInputElement;
          const zip = zipInput.value;
          if (!currentZipcodes.includes(zip) && zip.length === 5) {
            if (error) setError(undefined);
            onZipcodeChange([...currentZipcodes, zip]);
            zipInput.value = "";
          } else {
            setError("Please input a valid zipcode");
          }
        }}>
          <TextInput id="zipcode" label="Zipcode" placeholder="Input a valid zipcode" />
        </form>
        <div id="selected-zipcodes">
          {currentZipcodes.map((zip) => <FilterPill key={zip} data={currentZipcodes} changeData={onZipcodeChange}>{zip}</FilterPill>)}
        </div>
        {error && <ErrorAlert message={error} />}
      </div>
    );
  }

  function AgeFilter() {
    const [error, setError] = useState<string>();

    return (
      <div className="filter-option">
        <div>Age range</div>
        <div id="age-range">
          <div className="age-input">
            <TextInput id="ageMin" placeholder="Min" onEnter={() => {
              const minInput: HTMLInputElement = document.getElementById("ageMin") as HTMLInputElement;
              const maxInput: HTMLInputElement = document.getElementById("ageMax") as HTMLInputElement;
              if (minInput.value.length > 0) {
                if (!isNaN(parseInt(minInput.value)) && parseInt(minInput.value) > 0 && (!maxInput.value || parseInt(minInput.value) <= parseInt(maxInput.value))) {
                  if (error) setError(undefined);
                  onAgeMinChange(parseInt(minInput.value));
                  minInput.value = `${currentAgeMin as number}`;
                } else if (isNaN(parseInt(minInput.value))) {
                  setError("Not a valid number");
                } else if (parseInt(minInput.value) >= 0) {
                  setError("Age must be 0 or older");
                } else if (parseInt(minInput.value) > parseInt(maxInput.value)) {
                  setError("Minimum age must be smaller than the maximum age");
                } else {
                  setError("An error occured");
                }
              }
            }} /> <div style={{marginLeft: "10%"}}>years</div>
          </div>
           —&nbsp;
          <div className="age-input">
           <TextInput id="ageMax" placeholder="Max" onEnter={() => {
              const minInput: HTMLInputElement = document.getElementById("ageMin") as HTMLInputElement;
              const maxInput: HTMLInputElement = document.getElementById("ageMax") as HTMLInputElement;
              if (maxInput.value.length > 0) {
                if (!isNaN(parseInt(maxInput.value)) && parseInt(maxInput.value) > 0 && (!minInput.value || parseInt(minInput.value) <= parseInt(maxInput.value))) {
                  if (error) setError(undefined);
                  onAgeMaxChange(parseInt(maxInput.value));
                  maxInput.value = `${currentAgeMax as number}`;
                } else if (isNaN(parseInt(maxInput.value))) {
                  setError("Not a valid number");
                } else if (parseInt(maxInput.value) < 0) {
                  setError("Age must be 0 or older");
                } else if (parseInt(minInput.value) > parseInt(maxInput.value)) {
                  setError("Minimum age must be smaller than the maximum age");
                } else {
                  setError("An error occured");
                }
              }
            }} /> <div style={{marginLeft: "10%"}}>years</div>
          </div>
        </div>
        <div>
          {currentAgeMin && <p>Minimum age: {currentAgeMin} {currentAgeMin === 1 ? "year" : "years"}</p>}
          {currentAgeMax && <p>Maximum age: {currentAgeMax} {currentAgeMax === 1 ? "year" : "years"}</p>}
          {(currentAgeMin || currentAgeMax) && <Button id="reset-age" label="Reset age range" onClick={() => {
            onAgeMaxChange(undefined);
            onAgeMinChange(undefined);
          }} />}
        </div>
          {error && (
            <ErrorAlert message={error} />
          )}
      </div>
    );
  }

  return (
    <nav id="filter-menu">
      <h2>Filter</h2>
      <div id="filter-content">
        <BreedFilter />
        <ZipcodeFilter />
        <AgeFilter />
      </div>
    </nav>
  );
}