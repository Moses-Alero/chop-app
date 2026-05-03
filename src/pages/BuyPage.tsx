import React from 'react'


export interface HomeProps {
  onNavigate: (pages: 'home' | 'SpecialsPage' | 'Specials' | 'BuyPage') => void;
}

    const BuyPage: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
     <>
        <div id='banner' className='w-full -z-10 h-42 overflow-hidden fixed'>
            <img className='w-full absolute' src='/src/assets/foodWide.jpg' alt='banner image' />
        </div>
        <div id="top" className='flex flex-row justify-between items-center
      translate-y-10'>
       <button onClick={() => onNavigate('Specials')} id='location' className='bg-gray-200 w-15 h-8 rounded-lg flex flex-col 
        translate-x-5 justify-center items-center'>
            
                <img className='w-4 inline-block mr-1' src='/src/assets/back.png' alt='back icon' />
          
        </button>

        <div id='search' className='w-10  h-10 mr-5 flex rounded-b-2xl 
        rounded-t-2xl items-center bg-white '><img className='w-8  m-auto 
        ' src='/src/assets/search.png' alt='search icon' /></div>
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


    <div id='fourth-section' className='w-full h-auto bg-white pt-10 pb-40
    rounded-t-3xl mt-20'>
        <div className='w-[40%] h-2 bg-stone-300 m-auto -translate-y-8 rounded-2xl'></div>
        <p className='mt-4 ml-4 font-bold text-2xl'>Pepperoni pizza</p>
        <p className='mt-2 ml-4  text-lg'>
            Budget friendly menu feturing 10 skewers of chicken, beef, or
            assorted meat served with a side of fried rice and a drink of your choice.
        </p>
        <div id='price-row' className='w-full h-auto flex flex-row 
        justify-between'>
        <div id='pr' className='w-[45%] h-auto mt-4 ml-4 flex flex-col'>
            <p className=' font-bold text-xl'>Price</p>
            <p className='mt-4 font-bold text-2xl'>N5,000</p>
        </div>
        <div id='pr' className='w-[45%] h-auto mt-4 ml-4 flex flex-col '>
            <p className=' font-bold text-xl'>Quantity</p>
            <div id='quantity-choice' className='w-[70%] h-auto flex flex-row
            items-center justify-between mt-4 '>
            <button className='w-7 h-7 rounded-2xl bg-red-200 text-center
            items-center flex justify-center font-bold text-2xl '>-</button>
            <p className=' font-bold text-2xl'>2</p>
            <button className='w-7 h-7 rounded-2xl bg-red-200 text-center
            items-center flex justify-center font-bold text-2xl'>+</button>
            </div>
        </div>
</div>

        <p className='mt-4 ml-4 font-bold text-3xl'>Other Menu</p>

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
</div>
        
    </>
  )
}

export default BuyPage