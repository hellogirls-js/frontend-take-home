import { useEffect, useState } from "react";
import Select from "../components/utility/Select";
import { IconX } from "@tabler/icons-react";
import TextInput from "../components/utility/TextInput";

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

function FilterPill({ children, data, changeData }: {children: any, data: any[]; changeData: any; }) {
  return (
    <div className="filter-pill breed">
      <div className="filter-pill-text">
        {children}
      </div>
      <div className="filter-pill-x" onClick={(e) => {
        e.preventDefault();
        let i = data.indexOf(children);
        let newData = data.splice(i, 1);
        changeData(newData);
      }}>
        <IconX size={18} />
      </div>
    </div>
  )
}

export default function FilterMenu({ breedData, onBreedChange, currentBreeds }: { breedData: string[]; onBreedChange: any; currentBreeds: string[]}) {
  const [breedSelect, setBreedSelect] = useState<string>();

  useEffect(() => {
    if (breedSelect !== undefined) {
      onBreedChange([...currentBreeds, breedSelect]);
    }
  }, [breedSelect]);

  return (
    <nav id="filter-menu">
      <h2>Filter</h2>
      <div id="filter-content">
        <Select id="select-breed" label="Breed" data={breedData.map((breed) => { return { value: breed, label: breed } })} onChange={setBreedSelect} />
        <div id="selected-breeds">
          {currentBreeds.map((breed) => <FilterPill key={breed} data={currentBreeds} changeData={onBreedChange}>{breed}</FilterPill>)}
        </div>
        <TextInput id="zipcode" label="Zipcode" />
      </div>
    </nav>
  );
}