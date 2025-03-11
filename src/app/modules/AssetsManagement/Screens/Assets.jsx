import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { Header } from "components";
import Stats from "components/ui/Stats";
import {
  Briefcase,
  ClipboardList,
  Computer,
  Filter,
  Download,
  Database,
  Laptop,
  LayoutGrid,
  Smartphone,
  ListFilter,
} from "lucide-react";
// import { getAssets } from "app/hooks/assets";
import { useSelector } from "react-redux";
import { calculateTotalCount } from "utils/renderValues";
import { PageLoader } from "components";
import { DateRangeFilter } from "components/FormControl";
import ViewOptions from "components/ViewOtions";
import AddUpdateAsset from "./AddUpdateAsset";
import AssetsList from "./AssetsList";

const dummyAssets = [
  {
    id: 1,
    asset_id: "AST-0001",
    asset_name: 'MacBook Pro 16"',
    category: "Laptop",
    specifications: "Apple M1 Pro, 16GB RAM, 512GB SSD",
    serial_number: "C02G4D1NMD6R",
    location: "Headquarters",
    purchase_date: "2023-06-15",
    warranty_expiry: "2025-06-15",
    condition: "New",
    purchase_cost: 2499,
    notes: "Assigned to Design Team Lead",
    attachment: "https://example.com/attachments/laptop_receipt.pdf",
  },
  {
    id: 2,
    asset_id: "AST-0002",
    asset_name: "Dell XPS 15",
    category: "Laptop",
    specifications: "Intel i7, 32GB RAM, 1TB SSD",
    serial_number: "CN0H871T72872367",
    location: "Branch Office - North",
    purchase_date: "2023-04-10",
    warranty_expiry: "2025-04-10",
    condition: "New",
    purchase_cost: 1799,
    notes: "Assigned to Development Team",
    attachment: "https://example.com/attachments/dell_receipt.pdf",
  },
  {
    id: 3,
    asset_id: "AST-0003",
    asset_name: "iPhone 15 Pro",
    category: "Mobile",
    specifications: "256GB, Titanium Grey",
    serial_number: "G0PVLT5AQ6QX",
    location: "Headquarters",
    purchase_date: "2023-09-22",
    warranty_expiry: "2024-09-22",
    condition: "New",
    purchase_cost: 999,
    notes: "Assigned to Marketing Director",
    attachment: "https://example.com/attachments/iphone_receipt.pdf",
  },
  {
    id: 4,
    asset_id: "AST-0004",
    asset_name: "HP LaserJet Pro",
    category: "Printer",
    specifications: "M404dn, Monochrome, Duplex",
    serial_number: "VNC6H23708",
    location: "Branch Office - East",
    purchase_date: "2022-11-05",
    warranty_expiry: "2024-11-05",
    condition: "Used",
    purchase_cost: 349,
    notes: "Shared printer for East office",
    attachment: "https://example.com/attachments/printer_receipt.pdf",
  },
  {
    id: 5,
    asset_id: "AST-0005",
    asset_name: "Cisco Meraki Switch",
    category: "Networking",
    specifications: "MS120-24, 24-Port Gigabit",
    serial_number: "Q2HP-YDZQ-VN9C",
    location: "Headquarters",
    purchase_date: "2022-10-18",
    warranty_expiry: "2025-10-18",
    condition: "New",
    purchase_cost: 1299,
    notes: "Main server room - Rack 3",
    attachment: "https://example.com/attachments/switch_receipt.pdf",
  },
  {
    id: 6,
    asset_id: "AST-0006",
    asset_name: "Samsung S23 Ultra",
    category: "Mobile",
    specifications: "512GB, Black",
    serial_number: "R58M60CZAYP",
    location: "Branch Office - West",
    purchase_date: "2023-03-01",
    warranty_expiry: "2024-03-01",
    condition: "Needs Repair",
    purchase_cost: 1199,
    notes: "Screen cracked, awaiting repair",
    attachment: "https://example.com/attachments/samsung_receipt.pdf",
  },
  {
    id: 7,
    asset_id: "AST-0007",
    asset_name: "Herman Miller Aeron Chair",
    category: "Furniture",
    specifications: "Size B, Graphite",
    serial_number: "HM789456123",
    location: "Headquarters",
    purchase_date: "2022-12-15",
    warranty_expiry: "2034-12-15",
    condition: "New",
    purchase_cost: 1395,
    notes: "CEO Office",
    attachment: "https://example.com/attachments/chair_receipt.pdf",
  },
  {
    id: 8,
    asset_id: "AST-0008",
    asset_name: "LG UltraWide Monitor",
    category: "Computer",
    specifications: '34" 5K2K, HDR 600',
    serial_number: "307NTHR6H369",
    location: "Branch Office - North",
    purchase_date: "2023-07-22",
    warranty_expiry: "2026-07-22",
    condition: "New",
    purchase_cost: 899,
    notes: "Design Team",
    attachment: "https://example.com/attachments/monitor_receipt.pdf",
  },
  {
    id: 9,
    asset_id: "AST-0009",
    asset_name: "Surface Pro 9",
    category: "Laptop",
    specifications: "i7, 16GB RAM, 256GB SSD",
    serial_number: "093146811924",
    location: "Branch Office - South",
    purchase_date: "2023-08-30",
    warranty_expiry: "2025-08-30",
    condition: "Used",
    purchase_cost: 1599,
    notes: "Sales Team",
    attachment: "https://example.com/attachments/surface_receipt.pdf",
  },
  {
    id: 10,
    asset_id: "AST-0010",
    asset_name: "Sony WH-1000XM5",
    category: "Accessory",
    specifications: "Wireless Noise Cancelling Headphones",
    serial_number: "5412798633",
    location: "Headquarters",
    purchase_date: "2023-05-15",
    warranty_expiry: "2024-05-15",
    condition: "Needs Repair",
    purchase_cost: 399,
    notes: "Right ear cup not working",
    attachment: "https://example.com/attachments/headphones_receipt.pdf",
  },
];

const Assets = () => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [statsData, setStatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assetsList, setAssetsList] = useState(dummyAssets);
  const [openAddAssetModal, setOpenAddAssetModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeView, setActiveView] = useState("list");
  const [filterData, setFilterData] = useState({});

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        // const response = await getAssets({
        //   filterData: filterData,
        // });
        // if (response) {
        //   setAssetsList(response.results);
        // }
      }
    } catch (error) {
      console.error("Error fetching Assets", error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);

  useEffect(() => {
    if (assetsList) {
      setStatsData([
        {
          label: "Total Assets",
          value: assetsList.length,
          icon: Database,
        },
        {
          label: "Computers",
          value: calculateTotalCount(assetsList, "category", "Computer"),
          icon: Computer,
        },
        {
          label: "Laptops",
          value: calculateTotalCount(assetsList, "category", "Laptop"),
          icon: Laptop,
        },
        {
          label: "Mobile Devices",
          value: calculateTotalCount(assetsList, "category", "Mobile"),
          icon: Smartphone,
        },
      ]);
    }
  }, [assetsList]);

  if (isLoading) return <PageLoader />;

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <Button
            onClick={() => {
              setOpenAddAssetModal(true);
            }}
          >
            Add Asset
          </Button>
        }
      />
      <Stats stats={statsData} />
      <div className="flex flex-wrap items-center">
        <div className="flex flex-col justify-center self-stretch my-auto text-xl font-semibold tracking-normal leading-none text-fuchsia-700 w-[123px]">
          <div className="self-stretch pb-px w-full min-h-[28px] text-nowrap">
            Assets
          </div>
        </div>
        <div className="flex flex-1 shrink self-stretch pt-1.5 my-auto basis-0 h-[38px] min-w-[76px] w-[227px]" />
        <div className="flex flex-wrap gap-4 items-center self-stretch my-auto min-w-[240px] max-md:max-w-full">
          <DateRangeFilter
            activeDateRange={activeFilter}
            setDateRange={(dateRange) => {
              setFilterData((prevFilters) => {
                const updatedFilters = {
                  ...prevFilters,
                };
                setActiveFilter(dateRange);
                return updatedFilters;
              });
            }}
          />
          <ViewOptions activeView={activeView} setActiveView={setActiveView} />

          <Button
            variant="outline"
            size="sm"
            className="h-10 gap-1 rounded-3xl border-gray-100"
          >
            <Download size={16} />
            <span>Download</span>
          </Button>
        </div>
      </div>

      <AssetsList
        assetsList={assetsList}
        reload={() => {
          fetchData(true);
        }}
      />
      {openAddAssetModal && (
        <AddUpdateAsset
          setIsOpen={setOpenAddAssetModal}
          isOpen={openAddAssetModal}
          reload={() => {
            fetchData(true);
          }}
        />
      )}
    </div>
  );
};

export default Assets;
