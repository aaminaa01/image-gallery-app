import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import styles from '@/styles/DashboardPage.module.css';
import UploadModal from '@/components/UploadModal';
import { FaCamera } from 'react-icons/fa';


const index = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [userId, setUserId] = useState();
  const [userImages, setUserImages] = useState([]);
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [checkedImages, setCheckedImages] = useState([]);
  const [hasCheckedImages, setHasCheckedImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [usage, setUsage] = useState(null);
  const [space, setSpace] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch bandwidth data
      const bandwidthResponse = await fetch(` https://usage-monitoring-service-au42szmu7a-uc.a.run.app/api/consumedBandwidth/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (bandwidthResponse.ok) {
        const bandwidthData = await bandwidthResponse.json();
        setUsage(bandwidthData);
      } else {
        console.error("Failed to fetch bandwidth data from API");
      }

      // Fetch space data
      const spaceResponse = await fetch(`https://storage-monitoring-service-au42szmu7a-uc.a.run.app/api/consumedSpace/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (spaceResponse.ok) {
        const spaceData = await spaceResponse.json();
        setSpace(spaceData);
      } else {
        console.error("Failed to fetch space data from API");
      }

      // Fetch user images
      await fetchUserImages();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Run the fetchData function on every render
    fetchData();
  }, [userId]);


  useEffect(() => {
    if (!user) {
      router.push("/cloud/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) setUserId(user.username);
  }, [user])

  const uploadImage = async (formData) => {
    try {
      // Append userId to formData
      formData.append('userId', userId);

      const response = await fetch('https://storage-monitoring-service-au42szmu7a-uc.a.run.app/api/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Image uploaded successfully.....');
        // After uploading, fetch the updated list of images
        await fetchUserImages();
        fetchData();
        setImage(null);

        //get the alert message
        const responseObject = await response.json();
        console.log(responseObject);
        const alertMessage = responseObject.alertMessage;
        const message = responseObject.message;
        if (alertMessage) {
          alert(alertMessage);
        }
        console.log("Message:", message);

      } else {
        if (response.status === 413) {
          alert("Image Not Uploaded! Not Enough Space!");
        }
        else if (response.status === 429) {
          alert("Image Not Uploaded! You do not have enough bandwidth for today!");
        }
        const data = await response.json;
        console.error(data);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; // Re-throw the error so that the UploadModal can handle it
    }
  };

  const handleDelete = (imageIds) => {
    // if (window.confirm("Are you sure you want to delete the selected images?")) {
    deleteImages(imageIds);
    // }
  };

  const deleteImages = async (imageIdArr) => {
    try {
      for (const imageId of imageIdArr) {
        const response = await fetch('https://storage-monitoring-service-au42szmu7a-uc.a.run.app/api/deleteImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userId, imageIds: [imageId] }), // Wrap each image ID in an array
        });

        if (response.ok) {
          console.log(`Image ${imageId} deleted successfully.....`);
          fetchData();
        } else {
          if (response.status === 429) {
            alert("Image Not Deleted! You do not have enough bandwidth for today!");
          }
          console.error(`Failed to delete image ${imageId}.`);
        }
      }

      // After deleting all images, update state and fetch user images
      setCheckedImages([]);
      setHasCheckedImages(false);
      await fetchUserImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const fetchUserImages = async () => {
    try {
      const response = await fetch(`https://storage-monitoring-service-au42szmu7a-uc.a.run.app/api/viewGallery/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserImages(data.images);
      } else {
        console.error('Failed to fetch user images.');
      }
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  };

  const handleCheck = (imageId) => {
    setCheckedImages((prevCheckedImages) => {
      const newCheckedImages = prevCheckedImages.includes(imageId)
        ? prevCheckedImages.filter((id) => id !== imageId)
        : [...prevCheckedImages, imageId];

      setHasCheckedImages(newCheckedImages.length > 0);

      return newCheckedImages;
    });
  };

  const handleImageClick = (imageId, event) => {
    // Check if the click target is not the checkbox
    if (!event.target.classList.contains(styles.checkButton)) {
      setSelectedImage(imageId);
    }

  };

  // Fetch user images when the component mounts
  useEffect(() => {
    if (userId) {
      fetchUserImages();
    }
  }, [userId]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setShowModal(true);
  };

  const closeModal = () => {
    // Reset the image and hide the modal
    setImage(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        // Call the uploadImage function with the formData
        await uploadImage(formData);

        // Reset the image and hide the modal
        setImage(null);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // Optionally, you can display an error message to the user
    }
  };

  const EnlargedImageView = ({ image, onClose }) => {
    return (
      <div className={styles.enlargedImageView}>
        <div className={styles.closeButton} onClick={onClose}>
          &#10006; {/* This is the '×' character for the cross */}
        </div>
        <img src={`data:image/jpeg;base64,${image.data}`} alt={`Enlarged Image`} />
      </div>
    );
  };

  useEffect(() => {
    var box = document.getElementById("box");
    var file = document.getElementById("file");

    const handleClick = () => file.click();

    box.addEventListener('click', handleClick);

    return () => {
      box.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.storageInfo}>
          <p className={styles.storageItem}>Current Storage: {space ? space.consumedSpaceMB : '...'}/10 MB</p>
          <button className={styles.deleteButton} onClick={() => handleDelete(checkedImages)} disabled={!hasCheckedImages}>Delete</button>
          <p className={styles.storageItem}>Today's Usage: {usage ? usage.consumedBandwidthMB : '...'}/25 MB</p>
        </div>
        <div>
          <form className={styles.gallery} onSubmit={handleSubmit}>
            {userImages.map((image) => (
              <div key={image._id} className={styles.card} onClick={(event) => handleImageClick(image._id, event)}>
                <img src={`data:image/jpeg;base64,${image.data}`} alt={`User Image ${image._id}`} />
                <input
                  type="checkbox"
                  className={styles.checkButton}
                  onChange={(event) => handleCheck(image._id)}
                />
              </div>
            ))}
            <div className={styles.addCard} id="box">
              <FaCamera className={styles.icon} />
              <input
                id="file"
                type="file"
                className={styles.file}
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <UploadModal
          image={image}
          uploadImage={uploadImage}
          closeModal={closeModal}
        />
      )}


      {selectedImage && (
        <EnlargedImageView image={userImages.find(img => img._id === selectedImage)} onClose={() => setSelectedImage(null)} />
      )}

    </div>
  );
};

export default index;