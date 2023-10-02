import MobSidebar from './MobSidebar'
import Sidebar from './Sidebar'
const index = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      <div className='xl:block hidden'><Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>
      <div className='xl:hidden block'><MobSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>
    </>
  )
}

export default index