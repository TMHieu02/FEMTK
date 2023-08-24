import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import productAPI from "../../api/ProductAPI";
import CategoryAPI from "../../api/CategoryAPI";

import cogoToast from "cogo-toast";
import { set } from "lodash";

const CreatePost = () => {
  const [isLoading, setIsLoading] = useState(true);

  let { pathname } = useLocation();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(1);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagesId, setImagesId] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    console.log(category);
  };

  useEffect(() => {
    const getCate = async () => {
      const res = await CategoryAPI.getCategory();
      setCategories(res.data);
      setIsLoading(false);
    };

    getCate();
  }, []);

  const handleFileChange = (event) => {
    const files = event.target.files;
    setImages(files);
    handleUpload(files);
  };

  const handleUpload = async (files) => {
    try {
      let imagesIdCopy = []; // Tạo một mảng mới để lưu trữ các ID của các tệp được tải lên trong từng lần tải lên
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        const response = await productAPI.uploadImage(formData);
        imagesIdCopy.push(response.data); // Thêm ID của tệp được tải lên vào mảng mới
      }
      setImagesId(imagesId => imagesId.concat(imagesIdCopy)); // Nối mảng mới vào mảng cũ để lưu trữ tất cả các ID của các tệp đã được tải lên
      cogoToast.success("Image uploaded successfully!");
      console.log(imagesId);
    } catch (error) {
      console.error(error);
      setImagesId([]);
      cogoToast.error("Upload failed!");
      // Xử lý lỗi tại đây
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const params = {
      title: title,
      description: description,
      price: price,
      address: address,
      categoryId: 1,
      imageIds: imagesId.map((image) => image.id),
    };
    try {
      const response = await productAPI.createPost(params);
      if(response.status === 200)
      cogoToast.success("Tạo bài đăng thành công!");
      else 
      throw new Error("Create Post failed!");
    } catch (error) {
      cogoToast.error("Tạo bài đăng thất bại!");
      // Xử lý lỗi tại đây
    }
  };

  if (isLoading) {
    return (
      <div className="flone-preloader-wrapper">
        <div className="flone-preloader">
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <SEO titleTemplate="MyOrder" description="" />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Create Post", path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        <div className="container">
          <h1>Create Post</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="images" className="form-label">
                Images
              </label>
              <input
                type="file"
                className="form-control"
                id="images"
                multiple
                onChange={handleFileChange}
              />
              {imagesId.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt="Product image"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                />
              ))}
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                className="form-select"
                id="category"
                value={category || categories[0]?.id}
                onChange={handleCategoryChange}
              >
                {" "}
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                min={1}
                id="price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Create Post
            </button>
          </form>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default CreatePost;
