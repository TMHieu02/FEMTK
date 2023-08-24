import React, { useState } from "react";
import "./form_overlay.scss";
import { useEffect } from "react";
import { fetchProvinces, fetchDistricts, fetchWards } from "../../helpers/other";

function FormOverlay(props) {
    const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [childState, setChildState] = useState(props.childState);

  useEffect(() => {
    // Fetch provinces data and set it to provinces state
    // This should be replaced with your actual API call
    fetchProvinces().then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
        console.log("lấy distric")
      // Fetch districts based on the selected province
      // Replace with your actual API call
      fetchDistricts(selectedProvince).then((data) => {setDistricts(data); console.log(data);});
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      // Fetch wards based on the selected district
      // Replace with your actual API call
      fetchWards(selectedDistrict).then((data) => setWards(data));
    }
  }, [selectedDistrict]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict("");
    setSelectedWard("");
    setChildState({ ...childState, city: e.target.selectedOptions[0].innerText });
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedWard("");
    setChildState({ ...childState, district: e.target.selectedOptions[0].innerText });
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
    setChildState({ ...childState, ward: e.target.selectedOptions[0].innerText });
  };

  const handleCancelClick = () => {
    props.closeEdit();
  };

  const handleChangeState = (key, value) => {
    setChildState({ ...childState, [key]: value });
  };

  const handleSaveClick = () => {
    console.log("add user");
    // TODO: handle saving the form data
    props.handleAddressChange(props.index, childState);
    props.closeEdit();
    props.handleAddUserAddress(childState);
  };

  const handleSaveEditClick = () => {
    // TODO: handle saving the form data
    console.log("update user");
    props.handleAddressChange(props.index, childState);
    props.closeEdit();
    props.handleUpdateMyUserAddress(props.index,childState);
  };
  return (
    <>
      <div className="overlay show" onClick={handleCancelClick}></div>
      <form className="form-overlay">
        <label>
          Tên người nhận:
          <input
            type="text"
            name="nameRecipient"
            value={childState.nameRecipient}
            onChange={(e) => handleChangeState("nameRecipient", e.target.value)}
          />
        </label>
        <label>
          Số điện thoại:
          <input
            type="text"
            name="numberPhone"
            value={childState.numberPhone}
            onChange={(e) => handleChangeState("numberPhone", e.target.value)}
          />
        </label>
        <label>
          Địa chỉ:
          <input
            type="text"
            name="detailAddress"
            value={childState.detailAddress}
            onChange={(e) => handleChangeState("detailAddress", e.target.value)}
          />
        </label>
        <br/>
        {/* <label>
          District:
          <input
            type="text"
            name="district"
            value={childState.district}
            onChange={(e) => handleChangeState("district", e.target.value)}
          />
        </label>
        <label>
          Ward:
          <input
            type="text"
            name="ward"
            value={childState.ward}
            onChange={(e) => handleChangeState("ward", e.target.value)}
          />
        </label>
        <label>
          City:
          <input
            type="text"
            name="city"
            value={childState.city}
            onChange={(e) => handleChangeState("city", e.target.value)}
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            name="country"
            value={childState.country}
            onChange={(e) => handleChangeState("country", e.target.value)}
          />
        </label> */}
        <label>
        Tỉnh:
        <select value={selectedProvince} onChange={handleProvinceChange} name="">
          <option value="">Chọn Tỉnh</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Huyện:
        <select value={selectedDistrict} onChange={handleDistrictChange} name="district">
          <option value="">Chọn Huyện</option>
          {districts.map((district) => (
            <option key={district.id} value={district.code} name = {district.name}>
              {district.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Phường:
        <select value={selectedWard} onChange={handleWardChange}>
          <option value="">Chọn phường</option>
          {wards.map((ward) => (
            <option key={ward.id} value={ward.code}>
              {ward.name}
            </option>
          ))}
        </select>
      </label>
        <label>
          Zipcode:
          <input
            type="text"
            name="zipcode"
            value={childState.zipcode}
            onChange={(e) => handleChangeState("zipcode", e.target.value)}
          />
        </label>
        <br />
        <button
          type="button"
          className="save"
          onClick={props.isEditing ? handleSaveEditClick : handleSaveClick}
        >
          Save
        </button>
        <button type="button" onClick={handleCancelClick}>
          Cancel
        </button>
      </form>
    </>
  );
}

export default FormOverlay;
