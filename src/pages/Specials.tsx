import React from 'react'

export interface HomeProps {
  onNavigate: (pages: 'home' | 'SpecialsPage' | 'Specials' | 'BuyPage') => void;
}

    const Specials: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <>
        <div id='banner' className='w-full -z-10 h-42 overflow-hidden absolute'>
            <img className='w-full absolute' src='/src/assets/foodWide.jpg' alt='banner image' />
        </div>
        <div id="top" className='flex flex-row justify-between items-center
      translate-y-10'>
        <button onClick={() => onNavigate('SpecialsPage')} id='location' className='bg-gray-200 w-15 h-8 rounded-lg flex flex-col 
        translate-x-5 justify-center items-center'>
            
                <img className='w-4 inline-block mr-1' src='/src/assets/back.png' alt='back icon' />
            
        </button>

        <div id='search' className='w-10  h-10 mr-5 flex rounded-b-2xl 
        rounded-t-2xl items-center bg-white '><img className='w-8  m-auto 
        ' src='/src/assets/search.png' alt='search icon' /></div>
        </div>

        <div id='long-card' className='w-11/12 h-45 z-50
         bg-white rounded-2xl m-auto mt-20 shadow-lg'>
        <div id='top-long-card' className='flex'>
        <div id='long-name' className='mt-4 ml-4'>
           <p className='font-bold text-2xl '>OG pizza</p> 
           <p className='font-normal text-xl text-stone-400'>Pizza Hut</p> 
           </div>
        <div id='pinpoint' className='ml-auto mr-5 mt-6'>
              <img className='w-6 inline-block mr-1' src='/src/assets/pinpoint.png' alt='location icon' />
            </div>
        </div>
        <div id='bottom-long-card' className='flex justify-between mt-6 ml-4 mr-4'>
            <div id='rating'>
                <div className='flex flex-row items-center justify-center'>
                <img className='w-4 inline-block mr-1' src='/src/assets/star.png' alt='star icon' />
                <p className='font-bold'>4.9</p>
                </div>
                <p className='text-stone-400'>200+ ratings</p>
            </div>
            <div id='time'>
                <div className='flex flex-row items-center justify-center'>
                <img className='w-4 inline-block mr-1' src='/src/assets/time.png' alt='time icon' />
                <p className='font-bold'>30-40 min</p>
                </div>
                <p className='text-stone-400'>Delivery time</p>
            </div>
            <div id='price'>
                 <div className='flex flex-row items-center justify-center'>
                <img className='w-4 inline-block mr-1' src='/src/assets/deliver.png' alt='time icon' />
                <p className='font-bold'>N20,000</p>
                </div>
                <p className='text-stone-400'>Delivery time</p>
            </div>
        </div>
        </div>

        <div id="cart" className='w-[90%] fixed bg-red-700 rounded-2xl
        flex flex-row justify-between items-center h-16 bottom-4 z-50
        p-4 m-auto left-0 right-0 animate'>
            <div className=''>
            <p className='text-white '>Total Price</p>
            <p className='text-white font-bold'>40,000</p>
            </div>

            <button id='checkout-btn' className='bg-white text-red-700 font-bold
            rounded-2xl w-30 h-10 '>add to cart</button>
        </div>

        <p className='mt-4 ml-4 font-bold text-3xl'>Recomended Menu</p>

        <div  id='menu-cards' className='w-full h-auto flex flex-row 
       gap-2 justify-center mt-14'>
           <button onClick={() => onNavigate('BuyPage')} id='menu-card' className='w-40 h-52 bg-white rounded-2xl'>
                <div id='menu-pic' className='w-full h-28 rounded-t-2xl 
                bg-gray-200'>
                    <img className='w-full h-full rounded-t-2xl' src='/src/assets/foodWide.jpg' alt='menu pic' />
                    </div>
                <div id='menu-info' className='ml-2 mt-2'>
                    <p className='font-bold text-lg'>Pepperoni Pizza</p>
                    <p className='text-stone-400'>Pizza Hut</p>
                    <p className='font-bold mt-2'>N5,000</p>
                    </div>
                    <button id='add-btn' className='w-28 h-8 bg-amber-400 
                    rounded-2xl mt-2 ml-2'>+</button>
            </button>
            
            <button onClick={() => onNavigate('BuyPage')} id='menu-card' className='w-40 h-52 bg-white rounded-2xl'>
                <div id='menu-pic' className='w-full h-28 rounded-t-2xl 
                bg-gray-200'>
                    <img className='w-full h-full rounded-t-2xl' src='/src/assets/foodWide.jpg' alt='menu pic' />
                    </div>
                <div id='menu-info' className='ml-2 mt-2'>
                    <p className='font-bold text-lg'>Pepperoni Pizza</p>
                    <p className='text-stone-400'>Pizza Hut</p>
                    <p className='font-bold mt-2'>N5,000</p>
                    </div>
                    <button id='add-btn' className='w-28 h-8 bg-amber-400 
                    rounded-2xl mt-2 ml-2'>+</button>
            </button>
        </div>


        <div id='menu-cards' className='w-full h-auto flex flex-row 
       gap-2 justify-center mt-14'>
            <button id='menu-card' className='w-40 h-52 bg-white rounded-2xl'>
                <div id='menu-pic' className='w-full h-28 rounded-t-2xl 
                bg-gray-200'>
                    <img className='w-full h-full rounded-t-2xl' src='/src/assets/foodWide.jpg' alt='menu pic' />
                    </div>
                <div id='menu-info' className='ml-2 mt-2'>
                    <p className='font-bold text-lg'>Pepperoni Pizza</p>
                    <p className='text-stone-400'>Pizza Hut</p>
                    <p className='font-bold mt-2'>N5,000</p>
                    </div>
                    <button id='add-btn' className='w-28 h-8 bg-amber-400 
                    rounded-2xl mt-2 ml-2'>+</button>
            </button>
            
            <button id='menu-card' className='w-40 h-52 bg-white rounded-2xl'>
                <div id='menu-pic' className='w-full h-28 rounded-t-2xl 
                bg-gray-200'>
                    <img className='w-full h-full rounded-t-2xl' src='/src/assets/foodWide.jpg' alt='menu pic' />
                    </div>
                <div id='menu-info' className='ml-2 mt-2'>
                    <p className='font-bold text-lg'>Pepperoni Pizza</p>
                    <p className='text-stone-400'>Pizza Hut</p>
                    <p className='font-bold mt-2'>N5,000</p>
                    </div>
                    <button id='add-btn' className='w-28 h-8 bg-amber-400 
                    rounded-2xl mt-2 ml-2'>+</button>
            </button>
        </div>


        <div id='menu-cards' className='w-full h-auto flex flex-row 
       gap-2 justify-center mt-14'>
            <button id='menu-card' className='w-40 h-52 bg-white rounded-2xl'>
                <div id='menu-pic' className='w-full h-28 rounded-t-2xl 
                bg-gray-200'>
                    <img className='w-full h-full rounded-t-2xl' src='/src/assets/foodWide.jpg' alt='menu pic' />
                    </div>
                <div id='menu-info' className='ml-2 mt-2'>
                    <p className='font-bold text-lg'>Pepperoni Pizza</p>
                    <p className='text-stone-400'>Pizza Hut</p>
                    <p className='font-bold mt-2'>N5,000</p>
                    </div>
                    <button id='add-btn' className='w-28 h-8 bg-amber-400 
                    rounded-2xl mt-2 ml-2'>+</button>
            </button>
            
            <button id='menu-card' className='w-40 h-52 bg-white rounded-2xl'>
                <div id='menu-pic' className='w-full h-28 rounded-t-2xl 
                bg-gray-200'>
                    <img className='w-full h-full rounded-t-2xl' src='/src/assets/foodWide.jpg' alt='menu pic' />
                    </div>
                <div id='menu-info' className='ml-2 mt-2'>
                    <p className='font-bold text-lg'>Pepperoni Pizza</p>
                    <p className='text-stone-400'>Pizza Hut</p>
                    <p className='font-bold mt-2'>N5,000</p>
                    </div>
                    <button id='add-btn' className='w-28 h-8 bg-amber-400 
                    rounded-2xl mt-2 ml-2'>+</button>
            </button>
        </div>


        <div id='menu-cards' className='w-full h-auto flex flex-row 
       gap-2 justify-center mt-14'>
            <button id='menu-card' className='w-40 h-52 bg-white rounded-2xl'>
                <div id='menu-pic' className='w-full h-28 rounded-t-2xl 
                bg-gray-200'>
                    <img className='w-full h-full rounded-t-2xl' src='/src/assets/foodWide.jpg' alt='menu pic' />
                    </div>
                <div id='menu-info' className='ml-2 mt-2'>
                    <p className='font-bold text-lg'>Pepperoni Pizza</p>
                    <p className='text-stone-400'>Pizza Hut</p>
                    <p className='font-bold mt-2'>N5,000</p>
                    </div>
                    <button id='add-btn' className='w-28 h-8 bg-amber-400 
                    rounded-2xl mt-2 ml-2'>+</button>
            </button>
            
            <button id='menu-card' className='w-40 h-52 bg-white rounded-2xl'>
                <div id='menu-pic' className='w-full h-28 rounded-t-2xl 
                bg-gray-200'>
                    <img className='w-full h-full rounded-t-2xl' src='/src/assets/foodWide.jpg' alt='menu pic' />
                    </div>
                <div id='menu-info' className='ml-2 mt-2'>
                    <p className='font-bold text-lg'>Pepperoni Pizza</p>
                    <p className='text-stone-400'>Pizza Hut</p>
                    <p className='font-bold mt-2'>N5,000</p>
                    </div>
                    <button id='add-btn' className='w-28 h-8 bg-amber-400 
                    rounded-2xl mt-2 ml-2'>+</button>
            </button>
        </div>

        <div id='menu-cards' className='w-full h-auto flex flex-row 
       gap-2 justify-center mt-14'>
            <button id='menu-card' className='w-40 h-52 bg-white rounded-2xl'>
                <div id='menu-pic' className='w-full h-28 rounded-t-2xl 
                bg-gray-200'>
                    <img className='w-full h-full rounded-t-2xl' src='/src/assets/foodWide.jpg' alt='menu pic' />
                    </div>
                <div id='menu-info' className='ml-2 mt-2'>
                    <p className='font-bold text-lg'>Pepperoni Pizza</p>
                    <p className='text-stone-400'>Pizza Hut</p>
                    <p className='font-bold mt-2'>N5,000</p>
                    </div>
                    <button id='add-btn' className='w-28 h-8 bg-amber-400 
                    rounded-2xl mt-2 ml-2'>+</button>
            </button>
            
            <button id='menu-card' className='w-40 h-52 bg-white rounded-2xl'>
                <div id='menu-pic' className='w-full h-28 rounded-t-2xl 
                bg-gray-200'>
                    <img className='w-full h-full rounded-t-2xl' src='/src/assets/foodWide.jpg' alt='menu pic' />
                    </div>
                <div id='menu-info' className='ml-2 mt-2'>
                    <p className='font-bold text-lg'>Pepperoni Pizza</p>
                    <p className='text-stone-400'>Pizza Hut</p>
                    <p className='font-bold mt-2'>N5,000</p>
                    </div>
                    <button id='add-btn' className='w-28 h-8 bg-amber-400 
                    rounded-2xl mt-2 ml-2'>+</button>
            </button>
        </div>

        
    </>
  )
}

export default Specials