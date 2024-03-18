import React, { useState, useEffect } from 'react';
import {initializeApp, getApp} from 'firebase/app';
import {getFirestore, doc, getDoc, setDoc, collection, writeBatch,query, getDocs} from 'firebase/firestore'
import { getDatabase, set, push, ref, get, remove} from "firebase/database";
import { ref as sRef } from 'firebase/storage';
import {getStorage, uploadBytes, getMetadata, getDownloadURL} from "firebase/storage"
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast'
import { useToaster } from 'react-hot-toast';



const Blog= () => {
  const [data, setData] = useState({});
  const [imgUrl, setImgUrl] = useState('')
  const [newItem, setNewItem] = useState({
    id: uuidv4(),
    title: "",
    imageURL:imgUrl,
    content:''
  });
  const[selectedFile, setSelectedFile]=useState({
    imageURL:{}
  });
  
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [itsMainKey, setMainKey] =useState({})
 
  const toaster = useToaster()

  // Initialize Firebase

    const firebaseConfig = {
    apiKey: "AIzaSyCEDEwlNE6-CXsdhME6FRhdxke3HF5gU7A",
    authDomain: "gekonge-project.firebaseapp.com",
    projectId: "gekonge-project",
   //storageBucket:"gekonge-project.appspot.com",
    storageBucket: "gs://gekonge-project.appspot.com",  //"gekonge-project.appspot.com",  
    messagingSenderId: "853191641615",
    appId: "1:853191641615:web:49a91ec8568fd6be53f17a",
    databaseURL:"https://gekonge-project-default-rtdb.firebaseio.com/"  
    };

 const firebaseApp = initializeApp(firebaseConfig);

 const db = getDatabase();

 //const fireApp = getApp();
 const storage = getStorage()


 const handleFileChange = (e) => {
  const fileList = e.target.files;
  if (fileList.length > 0) {
      const selectedFileName = fileList[0].name;
      setFileName(selectedFileName);
      setSelectedFile(fileList[0]); // Store the selected file in state
      console.log(selectedFileName)
  } else {
      setFileName('');
      setSelectedFile(null);
  }
};


const storageRef = sRef(storage, 'images/' + fileName);

  // Function to fetch data from Firebase
  // useEffect(() => {
    
      const fetchData = async () => {
        setIsLoading(true);
        
       await get(ref(db, 'blog/'))
          .then(snapshot => {
            if (snapshot.exists()) {
              const fetchedData = snapshot.val();
              setData(fetchedData);
              //setData(null) // Optional: Log fetched data
            } else {
              console.log('No data available');
            }
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Error reading data:", error);
            setIsLoading(false);
          });
      };
  
       // Fetch data when component mounts
  
      // Clean-up function (optional)
      
   

    useEffect(() => {
      fetchData();
    }, []);

  const handleUpload = (e) => {
  
      const getPictures = () =>{
        getDownloadURL(storageRef)
          .then((url) => {
            // Use the URL to fetch the image data or display the image
            setImgUrl(url);
            setImageUploaded(true);
            alert('Uploaded succesfully')
          })
          .catch((error) => {
            // Uh-oh, an error occurred!
            console.error('Error getting download URL:', error);
          });
        }
          //getPictures()
        



    if (selectedFile) {
        const storageRef = sRef(storage, 'images/'+ fileName); // Adjust 'images/' to your desired path
        uploadBytes(storageRef, selectedFile)
        //  .then(()=>{
        //   setSelectedFile({imageURL:{}})
        //  })
        .then((snapshot) => {
            console.log('File uploaded successfully:', snapshot);
            getPictures()
            // Optionally, you can add further logic after successful upload
        })
        .catch((error) => {
            console.error('Error uploading file:', error);
        });
    } else {
        console.error('No file selected.');
    }


    // useEffect(()=>{
     
    // },[fileName])


};

  // Function to add new item to Firebase
  const addItem = () => {
    push(ref(db, 'blog/'), {...newItem, imageURL:imgUrl}) // Assuming newItem is the object you want to add
      .then((snapshot) => {
        const uniqueKey = snapshot.key;
        console.log(uniqueKey)
        setNewItem({
          // id: '', // Clearing newItem's fields after adding it to the database
          title: '',
         // imageURL: imgUrl,
          content: ''
        });
        fetchData()
        //setMainKey()
        localStorage.setItem(newItem.id, uniqueKey)
      //  const storedItem = localStorage.getItem(newItem.id);

        // Log the item
        console.log(storedItem, 'stored');
        console.log(newItem ,'newItem');
       // fetchData(); // Refresh data after adding new item
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error adding item:", error);
      });

  };

  // Function to delete item from Firebase
  const deleteItem = (item) => {
    const storedItem = localStorage.getItem(item);
  const itemPath = `blog/${storedItem}`;
const itemRef = ref(db, itemPath);
console.log(itemPath)
set(itemRef, null)
  .then(() => {
    console.log('Item deleted successfully');
    // Refresh data after deleting item if needed
    fetchData();
  })
  .catch((error) => {
    console.error('Error deleting item:', error);
  });
  };

  
const dataArray = Object.entries(data).flatMap(([key, value]) => [key, value]);

const filteredData = dataArray.filter(item => typeof item === 'object' && item !== null);

//console.log(filteredData, 'filtered');

//          
let text = 'This study investigates the evolving landscape of retail public relations (PR) in the digital era, focusing on Nigerias retail giants, ShopRite and SPAR. Chapter 1 outlines the historical significance of communication and its transformative role in societal and organisational dynamics. It emphasizes the shift towards contemporary digital tools like social media and e-marketing, shaping modern PR practices. Chapter 2 conducts a comprehensive literature review, exploring the nexus between digital communication tools and retail PR strategies. Theoretical frameworks such as Diffusion of Innovation and Social Influence Theory are employed to understand the complexities of digital PR in retail. Identified gaps in the literature point towards the need for further research in this area. Chapter 3 delineates the research methodology, employing a qualitative approach and case study design. It outlines the sampling techniques, data collection methods, analysis procedures, and ethical considerations to ensure a robust and ethical research framework. Through this study, we aim to provide insights into the impact of digital communication tools on retail PR practices, offering valuable implications for practitioners and scholars alike.'

function breakIntoParagraphs(text) {
  let paragraphLength = 100
  const words = text.split(' ');
  const paragraphs = [];
  let currentParagraph = words[0];

  for (let i = 1; i < words.length; i++) {
      if (currentParagraph.length + words[i].length + 1 <= paragraphLength) {
          currentParagraph += ' ' + words[i];
      } else {
          paragraphs.push(currentParagraph);
          currentParagraph = words[i];
      }
  }

  paragraphs.push(currentParagraph); // Append the last paragraph
  console.log(paragraphs)
  return paragraphs;
}




  return (
  <div className='w-full h-full flex flex-col'>
    <div className='sm:px-36 px-4'>
      <h1 className='text-4xl font-bold text-black'>BLOG ADMIN</h1>
    </div>
    <div className='sm:px-36 px-2'>
      <h2 className='text-xl text-yellow-800'>Blogs</h2>
      {/* {isLoading ? (
        <p>Loading...</p>
      ) : ( */}
        {/* <img src={imgUrl} alt="" className='w-16 h-16'/> */}
       <ul className='space-y-16'>
        {filteredData.map((entry) => (
          <li key={entry.id} className='border sm:px-12 px-2 p-4 rounded-lg'>
            <div className='w-full justify-center flex'>
              <embed   src={`${entry.imageURL}#toolbar=0`}  width="300px" height="300px" type="application/pdf"/>
               {/* <img src={entry.imageURL} alt="" className="w-90 h-80" /> */}
            </div>
            <h1 className="text-xl text-blue-950 font-bold">{entry.title}</h1>
            <p className='text-md text-black'>{breakIntoParagraphs(entry.content)}</p>
             <button onClick={() => deleteItem(entry.id)} className='bg-red-800 text-white'>Delete</button> 
          </li>
        ))}
        {/* {Object.entries(data).map((entry)=>(
           <button onClick={() => deleteItem(entry.id)}>Delete</button>
        ))} */}
       </ul>
      <div className='flex flex-col gap-4 py-8 sm:w-1/2 w-full'>
        <h1 className='text-xl'>ADD BLOG POST</h1>
         <div className='flex flex-col gap-6  justify-center'>
          
          <input
           className='h-10 w-full'
            type="file"
            placeholder="Enter Image Url"
            onChange={handleFileChange}
           />
           <div>
            <button onClick={handleUpload} className='text-white bg-yellow-500'>Upload Pdf</button>
          </div> 
          <input
            className='h-10 w-full'
             type="text"
             placeholder="Enter Title"
             value={newItem.title}
             onChange={(e) => setNewItem({...newItem, title:e.target.value})}
           />   
        {/* <textarea
           className='h-40 w-full'
           rows={4}
           cols={4}
           type="text"
           placeholder="Enter Content"
           value={newItem.content}
           onChange={(e) => setNewItem({...newItem, content:e.target.value})}
         /> */}
         </div>
       
       

       <div>
         <button onClick={addItem} disabled={!imageUploaded} className='text-white bg-slate-900'>Add Item</button>
       </div>
     
      </div>
    </div>
  </div>
  );
};

export default Blog;
