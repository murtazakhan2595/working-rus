import React, { useState } from "react";
import { Calendar, Plus, Save, Edit2, Trash2, Search, Filter } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const HolidayCalendarSettings = () => {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [holidays, setHolidays] = useState([
    {
      id: 1,
      country: "United Kingdom",
      countryCode: "GB",
      name: "New Year's Day",
      date: "2025-01-01",
      type: "Public Holiday",
      workweek: "Monday-Friday",
      enabled: true,
    },
    {
      id: 2,
      country: "United Kingdom",
      countryCode: "GB",
      name: "Good Friday",
      date: "2025-04-18",
      type: "Public Holiday",
      workweek: "Monday-Friday",
      enabled: true,
    },
    {
      id: 3,
      country: "United Kingdom",
      countryCode: "GB",
      name: "Christmas Day",
      date: "2025-12-25",
      type: "Public Holiday",
      workweek: "Monday-Friday",
      enabled: true,
    },
    {
      id: 4,
      country: "India",
      countryCode: "IN",
      name: "Republic Day",
      date: "2025-01-26",
      type: "National Holiday",
      workweek: "Monday-Saturday",
      enabled: true,
    },
    {
      id: 5,
      country: "India",
      countryCode: "IN",
      name: "Independence Day",
      date: "2025-08-15",
      type: "National Holiday",
      workweek: "Monday-Saturday",
      enabled: true,
    },
    {
      id: 6,
      country: "India",
      countryCode: "IN",
      name: "Gandhi Jayanti",
      date: "2025-10-02",
      type: "National Holiday",
      workweek: "Monday-Saturday",
      enabled: true,
    },
    {
      id: 7,
      country: "Pakistan",
      countryCode: "PK",
      name: "Pakistan Day",
      date: "2025-03-23",
      type: "National Holiday",
      workweek: "Monday-Friday",
      enabled: true,
    },
    {
      id: 8,
      country: "Pakistan",
      countryCode: "PK",
      name: "Independence Day",
      date: "2025-08-14",
      type: "National Holiday",
      workweek: "Monday-Friday",
      enabled: true,
    },
    {
      id: 9,
      country: "South Africa",
      countryCode: "ZA",
      name: "Human Rights Day",
      date: "2025-03-21",
      type: "Public Holiday",
      workweek: "Monday-Friday",
      enabled: true,
    },
    {
      id: 10,
      country: "South Africa",
      countryCode: "ZA",
      name: "Freedom Day",
      date: "2025-04-27",
      type: "Public Holiday",
      workweek: "Monday-Friday",
      enabled: true,
    },
  ]);

  const [currentHoliday, setCurrentHoliday] = useState({
    country: "",
    countryCode: "",
    name: "",
    date: "",
    type: "Public Holiday",
    workweek: "Monday-Friday",
    enabled: true,
  });

  const countries = [
    { code: "all", name: "All Countries" },
    { code: "GB", name: "United Kingdom" },
    { code: "IN", name: "India" },
    { code: "PK", name: "Pakistan" },
    { code: "ZA", name: "South Africa" },
  ];

  const holidayTypes = [
    "Public Holiday",
    "National Holiday",
    "Religious Holiday",
    "Regional Holiday",
    "Optional Holiday",
  ];

  const workweekOptions = [
    "Monday-Friday",
    "Monday-Saturday",
    "Sunday-Thursday",
    "Monday-Thursday, Saturday",
  ];

  const handleSaveHoliday = () => {
    if (currentHoliday.id) {
      setHolidays(
        holidays.map((h) => (h.id === currentHoliday.id ? currentHoliday : h))
      );
    } else {
      setHolidays([...holidays, { ...currentHoliday, id: Date.now() }]);
    }
    setIsEditing(false);
    setCurrentHoliday({
      country: "",
      countryCode: "",
      name: "",
      date: "",
      type: "Public Holiday",
      workweek: "Monday-Friday",
      enabled: true,
    });
  };

  const handleEditHoliday = (holiday) => {
    setCurrentHoliday(holiday);
    setIsEditing(true);
  };

  const handleDeleteHoliday = (id) => {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      setHolidays(holidays.filter((h) => h.id !== id));
    }
  };

  const handleToggleHoliday = (id) => {
    setHolidays(
      holidays.map((h) => (h.id === id ? { ...h, enabled: !h.enabled } : h))
    );
  };

  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentHoliday({
      country: "",
      countryCode: "",
      name: "",
      date: "",
      type: "Public Holiday",
      workweek: "Monday-Friday",
      enabled: true,
    });
  };

  const filteredHolidays = holidays.filter((holiday) => {
    const matchesCountry =
      selectedCountry === "all" || holiday.countryCode === selectedCountry;
    const holidayYear = new Date(holiday.date).getFullYear();
    const matchesYear = holidayYear === selectedYear;
    const matchesSearch =
      holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCountry && matchesYear && matchesSearch;
  });

  const getTypeColor = (type) => {
    const colors = {
      "Public Holiday": "bg-blue-100 text-blue-700",
      "National Holiday": "bg-purple-100 text-purple-700",
      "Religious Holiday": "bg-green-100 text-green-700",
      "Regional Holiday": "bg-orange-100 text-orange-700",
      "Optional Holiday": "bg-gray-100 text-gray-700",
    };
    return colors[type] || colors["Public Holiday"];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Group holidays by month
  const groupedHolidays = filteredHolidays.reduce((acc, holiday) => {
    const month = new Date(holiday.date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(holiday);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Holiday Calendar Configuration</h1>
          <p className="text-gray-600 mt-1">
            Country-wise holiday calendar & workweek configuration
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Holiday
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, country, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>
        </div>
      </div>

      {/* Holidays List - Grouped by Month */}
      <div className="space-y-6">
        {Object.keys(groupedHolidays).length > 0 ? (
          Object.keys(groupedHolidays)
            .sort((a, b) => new Date(a) - new Date(b))
            .map((month) => (
              <div key={month}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{month}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedHolidays[month].map((holiday) => (
                    <Card
                      key={holiday.id}
                      className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {holiday.name}
                          </h3>
                        </div>
                        <Switch
                          checked={holiday.enabled}
                          onCheckedChange={() => handleToggleHoliday(holiday.id)}
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm">
                          <span className="text-gray-600">Country:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {holiday.country} ({holiday.countryCode})
                          </span>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-600">Date:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {formatDate(holiday.date)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                              holiday.type
                            )}`}
                          >
                            {holiday.type}
                          </span>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-600">Workweek:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {holiday.workweek}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              holiday.enabled
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {holiday.enabled ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Button
                          onClick={() => handleEditHoliday(holiday)}
                          className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteHoliday(holiday.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No holidays found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentHoliday.id ? "Edit Holiday" : "Add New Holiday"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="holidayName" className="text-sm font-medium text-gray-700">
                  Holiday Name
                </Label>
                <input
                  id="holidayName"
                  type="text"
                  value={currentHoliday.name}
                  onChange={(e) =>
                    setCurrentHoliday({ ...currentHoliday, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., New Year's Day"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Country
                </Label>
                <select
                  id="country"
                  value={currentHoliday.countryCode}
                  onChange={(e) => {
                    const selected = countries.find((c) => c.code === e.target.value);
                    setCurrentHoliday({
                      ...currentHoliday,
                      countryCode: e.target.value,
                      country: selected?.name || "",
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="">Select Country</option>
                  {countries
                    .filter((c) => c.code !== "all")
                    .map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Date
                </Label>
                <input
                  id="date"
                  type="date"
                  value={currentHoliday.date}
                  onChange={(e) =>
                    setCurrentHoliday({ ...currentHoliday, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Holiday Type
                </Label>
                <select
                  id="type"
                  value={currentHoliday.type}
                  onChange={(e) =>
                    setCurrentHoliday({ ...currentHoliday, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  {holidayTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="workweek" className="text-sm font-medium text-gray-700">
                  Workweek Configuration
                </Label>
                <select
                  id="workweek"
                  value={currentHoliday.workweek}
                  onChange={(e) =>
                    setCurrentHoliday({ ...currentHoliday, workweek: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  {workweekOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={currentHoliday.enabled}
                  onCheckedChange={(checked) =>
                    setCurrentHoliday({ ...currentHoliday, enabled: checked })
                  }
                />
                <Label className="text-sm font-medium text-gray-700">Enable Holiday</Label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentHoliday({
                    country: "",
                    countryCode: "",
                    name: "",
                    date: "",
                    type: "Public Holiday",
                    workweek: "Monday-Friday",
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveHoliday}
                disabled={
                  !currentHoliday.name ||
                  !currentHoliday.country ||
                  !currentHoliday.date
                }
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save Holiday
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayCalendarSettings;

