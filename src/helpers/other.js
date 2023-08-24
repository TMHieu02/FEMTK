import provinces from "../data/province.json"
import districts from "../data/district"
import wards from "../data/ward"


export const fetchProvinces = async () => {
	return await Object.values(provinces);
  };
  
  export const fetchDistricts = async (provinceCode) => {
	let data = await Object.values(districts);
  	return data.filter((item) => item.parent_code === provinceCode);
  };
  
  export const fetchWards = async (districtCode) => {
	let data = await Object.values(wards);
	return data.filter((item) => item.parent_code === districtCode);
  
  };
  export const getProvinceCodeFromName = async (provinceName) => {
    const provinces = await fetchProvinces();
    const province = provinces.find((province) => province.name === provinceName);
    return province ? province.code : null;
  };
  
  export const getDistrictCodeFromName = async (districtName) => {
    const districts = await fetchDistricts();
    const district = districts.find((district) => district.name === districtName);
    return district ? district.code : null;
  };
  
  export const getWardCodeFromName = async (wardName) => {
    const wards = await fetchWards();
    const ward = wards.find((ward) => ward.name === wardName);
    return ward ? ward.code : null;
  };
  export const getProvinceNameFromCode = async (provinceCode) => {
    const provinces = await fetchProvinces();
    const province = provinces.find((province) => province.code === provinceCode);
    return province ? province.name : null;
  };
  
  export const getDistrictNameFromCode = async (districtCode) => {
    const districts = await fetchDistricts();
    const district = districts.find((district) => district.code === districtCode);
    return district ? district.name : null;
  };
  
  export const getWardNameFromCode = async (wardCode) => {
    const wards = await fetchWards();
    const ward = wards.find((ward) => ward.code === wardCode);
    return ward ? ward.name : null;
  };