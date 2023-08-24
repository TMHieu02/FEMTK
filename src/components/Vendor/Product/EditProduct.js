import React, { useEffect, useState } from 'react';
import './EditProduct.css';
import { MdAdd, MdRemove, MdClose, MdAddCircle } from 'react-icons/md';
import { editProduct, fetchProductById } from '../../../store/slices/product-vendor-slice';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories, selectCategories } from '../../../store/slices/categories-slice';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import cogoToast from 'cogo-toast';

function EditProduct() {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const categories = useSelector(selectCategories);
  const [category, setCategory] = React.useState(null);
  const [dateValidPromote, setDateValidPromote] = useState('');

  const [listAddAttribute, setListAddAttribute] = useState([]);
  const [listAddAttributeValue, setListAddAttributeValue] = useState([]);
  const [listRemoveAttributeValue, setListRemoveAttributeValue] = useState([]);
  const [listRemoveAttribute, setListRemoveAttribute] = useState([]);
  const [listEditAttribute, setListEditAttribute] = useState([]);
  const [listEditAttributeValue, setListEditAttributeValue] = useState([]);
  const [listAddImage, setListAddImage] = useState([]);
  const [listRemoveImage, setListRemoveImage] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchProductById(productId)).then((response) => {
      setProduct(response.payload.data);
      const newAttributes = [];
      for (let i = 0; i < response.payload.data.attributes.length; i++) {
        const values = [];
        for (let id = 0; id < response.payload.data.attributes[i]['attributeValues'].length; id++) {
          values.push({
            name: response.payload.data.attributes[i]['attributeValues'][id].name,
            Id: response.payload.data.attributes[i]['attributeValues'][id].Id,
          });
        }
        newAttributes.push({
          name: response.payload.data.attributes[i].name,
          Id: response.payload.data.attributes[i].Id,
          values,
        });
      }
      setAttributes(newAttributes);

      Promise.all(
        response.payload.data.images.map((image) => {
          return fetch(image.location)
            .then((response) => response.blob())
            .then((blob) => {
              const file = new File([blob], image.location.split('/').pop(), {
                type: blob.type,
              });
              return { file, previewUrl: URL.createObjectURL(blob) };
            });
        })
      )
        .then((results) => {
          const newImages = results.map((result) => result.file);
          const newPreviewImages = results.map((result) => result.previewUrl);
          setImages((images) => [...images, ...newImages]);
          setPreviewImages((previewImages) => [...previewImages, ...newPreviewImages]);
        })
        .catch((error) => {});
      const index = categoryOptions.findIndex((x) => x.value === response.payload.data.categoryId);
      setCategory(categoryOptions[index]);
      setDateValidPromote(new Date(response.payload.data.dateValidPromote).toISOString().slice(0, 10));
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(
      editProduct({
        basic: {
          name: product.name,
          description: product.description,
          price: product.price,
          promotionalPrice: product.promotionalPrice,
          dateValidPromote,
          quantity: product.quantity,
          video: product.video,
          categoryId: category.value,
        },
        listAddAttribute,
        listAddAttributeValue,
        listRemoveAttributeValue,
        listRemoveAttribute,
        listEditAttribute,
        listEditAttributeValue,
        listAddImage,
        listRemoveImage,
        id: product.Id,
      })
    ).then((res) => {
      if (res.payload.status === 200) {
        setTimeout(() => {
          navigate('/vendor/products');
        }, 3000);
        cogoToast.success('Successfully add new category, retun list after 3 sec', {
          position: 'bottom-right',
          hideAfter: 3,
          onClick: () => console.log('Clicked'),
        });
      }
    });
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index] = file;
        setImages(newImages);
        const newPreviewImages = [...previewImages];
        newPreviewImages[index] = reader.result;
        setListAddImage([...listAddImage, file]);
        setPreviewImages(newPreviewImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttributeChange = (index, key, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][key] = value;
    if (newAttributes[index].new) {
      const newListAddAttribute = [...listAddAttribute];
      const indexList = newListAddAttribute.findIndex((x) => x.Id === newAttributes[index].Id);
      if (indexList > -1) {
        newListAddAttribute[indexList] = newAttributes[index];
        setListAddAttribute([...newListAddAttribute]);
      } else setListAddAttribute([...listAddAttribute, newAttributes[index]]);
    } else {
      const newListEditAttribute = [...listEditAttribute];
      const indexList = newListEditAttribute.findIndex((x) => x.Id === newAttributes[index].Id);
      if (indexList > -1) {
        newListEditAttribute[indexList] = newAttributes[index];
        setListEditAttribute([...newListEditAttribute]);
      } else setListEditAttribute([...listEditAttribute, newAttributes[index]]);
    }
    setAttributes(newAttributes);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: '', new: true, values: [], Id: generateRandomId() }]);
  };
  function generateRandomId() {
    const randomNumber = Math.random();
    const idString = randomNumber.toString(36).substr(2, 9);

    const prefix = 'my-id-';
    return prefix + idString;
  }
  const removeAttribute = (index) => {
    const newAttributes = [...attributes];
    if (!newAttributes[index].new) setListRemoveAttribute([...listRemoveAttribute, newAttributes[index]]);
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const handleAttributeValueChange = (index, valueIndex, value) => {
    const newAttributes = [...attributes];
    newAttributes[index].values[valueIndex]['name'] = value;
    if (newAttributes[index].values[valueIndex].new) {
      const newList = [...listAddAttributeValue];
      const indexList = newList.findIndex((x) => x.Id === newAttributes[index].values[valueIndex].Id);
      if (indexList > -1) {
        newList[indexList] = newAttributes[index].values[valueIndex];
        setListAddAttributeValue([...newList]);
      } else setListAddAttributeValue([...listAddAttributeValue, newAttributes[index].values[valueIndex]]);
    } else {
      const newList = [...listEditAttributeValue];
      const indexList = newList.findIndex((x) => x.Id === newAttributes[index].values[valueIndex].Id);
      if (indexList > -1) {
        newList[indexList] = newAttributes[index].values[valueIndex];
        setListEditAttributeValue([...newList]);
      } else setListEditAttributeValue([...listEditAttributeValue, newAttributes[index].values[valueIndex]]);
    }
    setAttributes(newAttributes);
  };

  const addAttributeValue = (index) => {
    const newAttributes = [...attributes];
    newAttributes[index].values.push({
      name: '',
      new: true,
      Id: newAttributes[index]['Id'].includes('my-id-') ? generateRandomId() : newAttributes[index]['Id'],
      attributeId: newAttributes[index].Id,
    });
    setAttributes(newAttributes);
  };

  const removeAttributeValue = (index, valueIndex) => {
    const newAttributes = [...attributes];
    if (!newAttributes[index].values[valueIndex].new)
      setListRemoveAttributeValue([...listRemoveAttributeValue, newAttributes[index].values[valueIndex]]);
    newAttributes[index].values.splice(valueIndex, 1);
    setAttributes(newAttributes);
  };

  const removeImage = (index) => {
    const newImages = [...images];

    const indexList = product.images.findIndex((x) => x['location'].includes(images[index]['name']));
    setListRemoveImage([...listRemoveImage, product.images[indexList].id]);
    newImages.splice(index, 1);
    setImages(newImages);
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);
  };
  const categoryOptions = categories.list.map((category) => ({
    value: category.Id,
    label: category.name,
  }));
  const handleCategoryChange = (selectedOption) => {
    setCategory(selectedOption);
  };
  return (
    <div className="product-form">
      <h1 style={{ textAlign: 'center' }}>EDIT PRODUCT</h1>
      <form onSubmit={handleSubmit}>
        <div className="columns">
          <div className="column">
            <label>
              Name:
              <input
                type="text"
                value={product?.name || ''}
                onChange={(e) => {
                  setProduct({ ...product, name: e.target.value });
                }}
                required
              />
            </label>

            <label>
              Category:
              <Select
                options={categoryOptions}
                onChange={handleCategoryChange}
                value={category}
                defaultValue={category}
                isSearchable
              />
            </label>

            <label>Attributes</label>
            {attributes.map((attribute, index) => (
              <div key={index} className="attribute-container ">
                <div className="attribute">
                  <div>
                    <label>Name:</label>
                    <input
                      type="text"
                      value={attribute.name || ''}
                      onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <button
                    className="remove-attribute-button"
                    type="button"
                    onClick={() => removeAttribute(index)}
                  >
                    <MdClose />
                  </button>
                </div>
                {attribute.values.map((value, valueIndex) => (
                  <div key={valueIndex} className="attribute-value">
                    <label style={{ marginRight: '20px' }}>Value:</label>
                    <input
                      type="text"
                      value={value?.name || ''}
                      onChange={(e) => handleAttributeValueChange(index, valueIndex, e.target.value)}
                      required
                    />
                    <button
                      className="remove-attribute-value-button"
                      type="button"
                      onClick={() => removeAttributeValue(index, valueIndex)}
                    >
                      <MdRemove />
                    </button>
                  </div>
                ))}
                <button
                  className="add-attribute-value-button"
                  type="button"
                  onClick={() => addAttributeValue(index)}
                >
                  <MdAddCircle />
                </button>
              </div>
            ))}
            <button type="button" onClick={addAttribute} className="add-attribute-button">
              <MdAdd /> Add Attribute
            </button>
            <label>
              Description:
              <textarea
                style={{ height: '200px' }}
                value={product?.description || ''}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="column">
            <label>
              Price:
              <input
                type="number"
                value={product?.price || ''}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                required
              />
            </label>
            <label>
              Promotional Price:
              <input
                type="number"
                value={product?.promotionalPrice || ''}
                onChange={(e) => setProduct({ ...product, promotionalPrice: e.target.value })}
              />
            </label>
            <label>
              Date Valid Promote:
              <input
                type="date"
                value={dateValidPromote}
                onChange={(e) => setDateValidPromote(e.target.value)}
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                value={product?.quantity || ''}
                onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                required
              />
            </label>
            <label>
              Video:
              <input
                type="text"
                value={product?.video || ''}
                onChange={(e) => setProduct({ ...product, video: e.target.value })}
              />
            </label>
            <label>Images</label>
            {previewImages.map((previewImage, index) => (
              <div key={index} className="image-preview">
                <img
                  src={previewImage}
                  alt={`Preview ${index}`}
                  style={{ width: '200px', height: '200px' }}
                />
                <button className="remove-image-button" type="button" onClick={() => removeImage(index)}>
                  <MdClose />
                </button>
              </div>
            ))}
            <div className="image-upload">
              <label>
                <MdAdd /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  width={100}
                  onChange={(e) => handleImageUpload(e, images.length)}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>
        <button type="submit">Edit Product</button>
      </form>
    </div>
  );
}

export default EditProduct;
