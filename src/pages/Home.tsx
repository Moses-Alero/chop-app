import React from 'react'
// import { Link } from 'react-router-dom'
// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'


export interface HomeProps {
  onNavigate: (pages: 'home' | 'SpecialsPage' | 'Specials' | 'BuyPage') => void;
}

// 2. Apply the interface to the function component
const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
<>
    <div id='top-banner' className='overflow-hidden'>

    <div id="top" className='flex flex-row justify-between items-center
      translate-y-5'>
        <div id='location' className='bg-gray-200 w-35 h-8 rounded-lg flex flex-col translate-x-5 justify-center items-center'>
            <p className='font-bold sans-serif text-black-200'>Current location</p>
        </div>

        <div id='notification'><img className='w-10 -translate-x-5' src='/src/assets/notification.png' alt='notification icon' /></div>
        </div>
        
<div className='w-auto h-26 translate-y-0
         '><img className='w-xl' src='/src/assets/food.png' alt='food banner' /></div>

        <p className=' translate-x-3 font-bold font-sans-serif absolute text-amber-50
         text-xl '>Hungry? We've Got You Covered!</p>

    </div>
    <div id='search-bar' className='-translate-y-5 translate-x-3 bg-white w-11/12 h-8 rounded-lg flex 
        flex-row items-center px-2 gap-2 shadow-lg'>
            <img className='w-8' src='/src/assets/search.png' alt='search icon' />
            <input className='outline-0' type='text' placeholder='what do you want to eat?' />
        </div>

    <div id='categories' className=' w-full h-auto flex flex-row 
        flex-wrap '>
            <div id='category-wrap' className='flex flex-wrap gap-2'>
        <button className='category '>
            <div id='cat-pic'></div>
            <p id='cat-p'>near me</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        </div>
        </div>

        <div id='cuisines'  className=' w-full h-auto flex flex-row 
        flex-wrap translate-y-5'>
            <div id='header' className=' flex flex-row justify-between items-center px-3 mb-2'>
            <h2 className=' font-bold sans-serif text-black-200'>Popular Cuisines</h2>
            <button onClick={() => onNavigate('SpecialsPage')} className='sans-serif text-red-600'>See All</button>
            </div>
            <div id='category-wrap' className='flex flex-wrap gap-2'>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        </div>
        </div>

        <div id='specials' className=' w-full h-auto flex flex-row 
        flex-wrap translate-y-5'>
            <div id='header' className=' flex flex-row justify-between items-center px-3 mb-2'>
            <h2 className='font-bold sans-serif text-black-200'>Popular Specials</h2>
            <button className='sans-serif text-red-600'>See All</button>
            </div>
            <div id='category-wrap' className='flex flex-wrap gap-2'>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        <button className='category'>
            <div id='cat-pic'></div>
            <p id='cat-p'>big promo</p>
        </button>
        </div>
        </div>

        <div id='bottom-space' className='w-full flex rounded-e-xl shadow-lg translate-y-5'>
            <div id='bottom-wrap' className='flex flex-wrap gap-2'>
            <button id='explore' className='category'>
                <div id='bottom-pic'><img src='/src/assets/explore.png'/></div>
                <p id='cat-p'>Explore</p>
            </button>
            <button id='chart' className='category'>
                <div id='bottom-pic'><img src='/src/assets/chart.png'/></div>
                <p id='cat-p'>Cart</p>
            </button>
            <button id='history' className='category'>
                <div id='bottom-pic'><img src='/src/assets/history.png'/></div>
                <p id='cat-p'>History</p>
            </button>
            <button id='profile' className='category'>
                <div id='bottom-pic'><img src='/src/assets/profile.png'/></div>
                <p id='cat-p'>Profile</p>
            </button>
        </div>
        </div>

    </>
  )
}


export default Home