
import React from 'react'



export interface HomeProps {
  onNavigate: (pages: 'home' | 'SpecialsPage' | 'Specials' | 'BuyPage') => void;
}

    const SpecialsPage: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <>
         <div id='top-banner' className='overflow-hidden'>

    <div id="top" className='flex flex-row justify-between items-center
      translate-y-5'>
      <button onClick={() => onNavigate('home')} id='location' className='bg-gray-200 w-15 h-8 rounded-lg flex flex-col translate-x-5 justify-center items-center'>
            
                <img className='w-4 inline-block mr-1' src='/src/assets/back.png' alt='back icon' />
            
        </button>
        <div id='notification'><img className='w-10 -translate-x-5' src='/src/assets/notification.png' alt='notification icon' /></div>
        </div>
        
<div className='w-auto h-26 translate-x-36
         '><img className='w-xl' src='/src/assets/specials.png' alt='specials banner' /></div>

        <p className=' translate-x-3 font-bold font-sans-serif text-amber-50
         text-3xl '>Specials</p>
         
         <p className='translate-x-3 w-2xs translate-y-4
         font-sans-serif absolute text-shadow-amber-50 text-stone-300
         text-24 '>Choose form nearby restaurants with delicious awaiting</p>
        
    </div>

       <div id='search-bar' className='-translate-y-5 translate-x-3 bg-white w-11/12 h-8 rounded-lg flex 
        flex-row items-center px-2 gap-2 shadow-lg'>
            <img className='w-8' src='/src/assets/search.png' alt='search icon' />
            <input className='outline-0' type='text' placeholder='what do you want to eat?' />
        </div>

        <div id='filter' className=' w-full h-auto flex flex-row gap-1'>
        <button className='filter-btn translate-x-3 -translate-y-2 width-auto bg-stone-300
        rounded-tl-full rounded-bl-full rounded-br-full rounded-tr-full'>
            <img className='w-8 m-2' src='/src/assets/filter.png' alt='filter icon' />
        </button>
        <button className='filter-btn translate-x-3 -translate-y-2 width-auto bg-stone-300
        rounded-tl-full rounded-bl-full rounded-br-full rounded-tr-full'>
            <p className='font-sans-serif text-l m-2'>cuisines</p>
        </button>
        <button className='filter-btn translate-x-3 -translate-y-2 width-auto bg-stone-300
        rounded-tl-full rounded-bl-full rounded-br-full rounded-tr-full'>
            <p className='font-sans-serif text-l m-2'>rated 4.5+</p>
        </button>
        <button className='filter-btn translate-x-3 -translate-y-2 width-auto bg-stone-300
        rounded-tl-full rounded-bl-full rounded-br-full rounded-tr-full'>
            <p className='font-sans-serif text-l m-2'>promo</p>
        </button>

        
        </div>


      <button onClick={() => onNavigate('Specials')} id='card' className='w-[90%] h-44  m-auto flex flex-row 
        gap-5 items-center rounded-lg shadow-lg mt-4'>
            <div id='image-section' className='w-[40%] '>
                <img src='./src/assets/cardPic.png' className='w-auto h-32 m-auto'/>
                <p className='text-black rounded-2xl
                text-center font-sans font-bold'>Best seller</p>
            </div>
            <div id='info-section' className='w-[40%] gap-2'>
                <p id='rest-name' className='text-2xl font-bold'>Pizza Hut</p>
                <p id='food-name' className='text-stone-400 text-lg'>OG pizza</p>
                <div id='price-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/deliver.png' className='w-6 h-6'/><p id='price' className='text-lg font-bold'>N10,000</p>
                </div>
                <div id='time-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/time.png' className='w-6 h-6'/><p id='time' 
                className='text-stone-400 text-lg'>10-20 mins</p>
                </div>
                <div id='rating-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/star.png' className='w-6 h-6'/>
                <p id='rating' className='text-stone-400 text-lg'>4.5</p>
                </div>
            </div>
        </button>

       
         <button onClick={() => onNavigate('Specials')} id='card' className='w-[90%] h-44  m-auto flex flex-row 
        gap-5 items-center rounded-lg shadow-lg mt-4'>
            <div id='image-section' className='w-[40%] '>
                <img src='./src/assets/cardPic.png' className='w-auto h-32 m-auto'/>
                <p className='text-black rounded-2xl
                text-center font-sans font-bold'>Best seller</p>
            </div>
            <div id='info-section' className='w-[40%] gap-2'>
                <p id='rest-name' className='text-2xl font-bold'>Pizza Hut</p>
                <p id='food-name' className='text-stone-400 text-lg'>OG pizza</p>
                <div id='price-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/deliver.png' className='w-6 h-6'/><p id='price' className='text-lg font-bold'>N10,000</p>
                </div>
                <div id='time-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/time.png' className='w-6 h-6'/><p id='time' 
                className='text-stone-400 text-lg'>10-20 mins</p>
                </div>
                <div id='rating-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/star.png' className='w-6 h-6'/>
                <p id='rating' className='text-stone-400 text-lg'>4.5</p>
                </div>
            </div>
        </button>
 

  <button id='card' className='w-[90%] h-44  m-auto flex flex-row 
        gap-5 items-center rounded-lg shadow-lg mt-4'>
            <div id='image-section' className='w-[40%] '>
                <img src='./src/assets/cardPic.png' className='w-auto h-32 m-auto'/>
                <p className='text-black rounded-2xl
                text-center font-sans font-bold'>Best seller</p>
            </div>
            <div id='info-section' className='w-[40%] gap-2'>
                <p id='rest-name' className='text-2xl font-bold'>Pizza Hut</p>
                <p id='food-name' className='text-stone-400 text-lg'>OG pizza</p>
                <div id='price-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/deliver.png' className='w-6 h-6'/><p id='price' className='text-lg font-bold'>N10,000</p>
                </div>
                <div id='time-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/time.png' className='w-6 h-6'/><p id='time' 
                className='text-stone-400 text-lg'>10-20 mins</p>
                </div>
                <div id='rating-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/star.png' className='w-6 h-6'/>
                <p id='rating' className='text-stone-400 text-lg'>4.5</p>
                </div>
            </div>
        </button>

         <button id='card' className='w-[90%] h-44  m-auto flex flex-row 
        gap-5 items-center rounded-lg shadow-lg mt-4'>
            <div id='image-section' className='w-[40%] '>
                <img src='./src/assets/cardPic.png' className='w-auto h-32 m-auto'/>
                <p className='text-black rounded-2xl
                text-center font-sans font-bold'>Best seller</p>
            </div>
            <div id='info-section' className='w-[40%] gap-2'>
                <p id='rest-name' className='text-2xl font-bold'>Pizza Hut</p>
                <p id='food-name' className='text-stone-400 text-lg'>OG pizza</p>
                <div id='price-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/deliver.png' className='w-6 h-6'/><p id='price' className='text-lg font-bold'>N10,000</p>
                </div>
                <div id='time-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/time.png' className='w-6 h-6'/><p id='time' 
                className='text-stone-400 text-lg'>10-20 mins</p>
                </div>
                <div id='rating-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/star.png' className='w-6 h-6'/>
                <p id='rating' className='text-stone-400 text-lg'>4.5</p>
                </div>
            </div>
        </button>

         <button id='card' className='w-[90%] h-44  m-auto flex flex-row 
        gap-5 items-center rounded-lg shadow-lg mt-4'>
            <div id='image-section' className='w-[40%] '>
                <img src='./src/assets/cardPic.png' className='w-auto h-32 m-auto'/>
                <p className='text-black rounded-2xl
                text-center font-sans font-bold'>Best seller</p>
            </div>
            <div id='info-section' className='w-[40%] gap-2'>
                <p id='rest-name' className='text-2xl font-bold'>Pizza Hut</p>
                <p id='food-name' className='text-stone-400 text-lg'>OG pizza</p>
                <div id='price-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/deliver.png' className='w-6 h-6'/><p id='price' className='text-lg font-bold'>N10,000</p>
                </div>
                <div id='time-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/time.png' className='w-6 h-6'/><p id='time' 
                className='text-stone-400 text-lg'>10-20 mins</p>
                </div>
                <div id='rating-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/star.png' className='w-6 h-6'/>
                <p id='rating' className='text-stone-400 text-lg'>4.5</p>
                </div>
            </div>
        </button>

         <button id='card' className='w-[90%] h-44  m-auto flex flex-row 
        gap-5 items-center rounded-lg shadow-lg mt-4'>
            <div id='image-section' className='w-[40%] '>
                <img src='./src/assets/cardPic.png' className='w-auto h-32 m-auto'/>
                <p className='text-black rounded-2xl
                text-center font-sans font-bold'>Best seller</p>
            </div>
            <div id='info-section' className='w-[40%] gap-2'>
                <p id='rest-name' className='text-2xl font-bold'>Pizza Hut</p>
                <p id='food-name' className='text-stone-400 text-lg'>OG pizza</p>
                <div id='price-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/deliver.png' className='w-6 h-6'/><p id='price' className='text-lg font-bold'>N10,000</p>
                </div>
                <div id='time-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/time.png' className='w-6 h-6'/><p id='time' 
                className='text-stone-400 text-lg'>10-20 mins</p>
                </div>
                <div id='rating-section' className='w-full gap-1 flex flex-row'>
                <img src='./src/assets/star.png' className='w-6 h-6'/>
                <p id='rating' className='text-stone-400 text-lg'>4.5</p>
                </div>
            </div>
        </button>

         </>
  )
}

export default SpecialsPage