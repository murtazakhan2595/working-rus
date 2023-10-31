import EmpDataHeader from "./EmpDataHeader";

const EmpDataSheet = () => {

  return (
    <div className="flex w-full flex-col bg-[#F9F9F9]">
    <EmpDataHeader title="Employee Data Sheet" />
      {/* Table */}
      <div className=" px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-6 overflow-x-auto overflow-y-auto max-h-[72vh] xScroll">
        <table class="min-w-full ">
          <thead>
            <tr className="text-baseBlue bg-[#F2F2F2] whitespace-nowrap">
              <th class="px-6 py-3 text-left rounded-tl-lg">Photo</th>
              <th class="px-6 py-3 text-left">Employee ID</th>
              <th class="px-6 py-3 text-left">Name</th>
              <th class="px-6 py-3 text-left">Email</th>
              <th class="px-6 py-3 text-left">Role</th>
              <th class="px-6 py-3 text-left">National Identity</th>
              <th class="px-6 py-3 text-left rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-500 ">
            <tr className="whitespace-nowrap border-b-2">
              <td class="px-6 py-3 text-left">Photo</td>
              <td class="px-6 py-3 text-left">876569</td>
              <td class="px-6 py-3 text-left">Syed Umair</td>
              <td class="px-6 py-3 text-left">hello@tecbrix.com</td>
              <td class="px-6 py-3 text-left">Developer</td>
              <td class="px-6 py-3 text-left">4250-876545-9</td>
              <td class="px-6 py-3 text-left">Action here</td>
            </tr>
            <tr className="whitespace-nowrap border-b-2">
              <td class="px-6 py-3 text-left">Photo</td>
              <td class="px-6 py-3 text-left">876569</td>
              <td class="px-6 py-3 text-left">Syed Umair</td>
              <td class="px-6 py-3 text-left">hello@tecbrix.com</td>
              <td class="px-6 py-3 text-left">Developer</td>
              <td class="px-6 py-3 text-left">4250-876545-9</td>
              <td class="px-6 py-3 text-left">Action here</td>
            </tr>
            <tr className="whitespace-nowrap border-b-2">
              <td class="px-6 py-3 text-left">Photo</td>
              <td class="px-6 py-3 text-left">876569</td>
              <td class="px-6 py-3 text-left">Syed Umair</td>
              <td class="px-6 py-3 text-left">hello@tecbrix.com</td>
              <td class="px-6 py-3 text-left">Developer</td>
              <td class="px-6 py-3 text-left">4250-876545-9</td>
              <td class="px-6 py-3 text-left">Action here</td>
            </tr>
            <tr className="whitespace-nowrap border-b-2">
              <td class="px-6 py-3 text-left">Photo</td>
              <td class="px-6 py-3 text-left">876569</td>
              <td class="px-6 py-3 text-left">Syed Umair</td>
              <td class="px-6 py-3 text-left">hello@tecbrix.com</td>
              <td class="px-6 py-3 text-left">Developer</td>
              <td class="px-6 py-3 text-left">4250-876545-9</td>
              <td class="px-6 py-3 text-left">Action here</td>
            </tr>
            <tr className="whitespace-nowrap border-b-2">
              <td class="px-6 py-3 text-left">Photo</td>
              <td class="px-6 py-3 text-left">876569</td>
              <td class="px-6 py-3 text-left">Syed Umair</td>
              <td class="px-6 py-3 text-left">hello@tecbrix.com</td>
              <td class="px-6 py-3 text-left">Developer</td>
              <td class="px-6 py-3 text-left">4250-876545-9</td>
              <td class="px-6 py-3 text-left">Action here</td>
            </tr>
            <tr className="whitespace-nowrap border-b-2">
              <td class="px-6 py-3 text-left">Photo</td>
              <td class="px-6 py-3 text-left">876569</td>
              <td class="px-6 py-3 text-left">Syed Umair</td>
              <td class="px-6 py-3 text-left">hello@tecbrix.com</td>
              <td class="px-6 py-3 text-left">Developer</td>
              <td class="px-6 py-3 text-left">4250-876545-9</td>
              <td class="px-6 py-3 text-left">Action here</td>
            </tr>
            <tr className="whitespace-nowrap border-b-2">
              <td class="px-6 py-3 text-left">Photo</td>
              <td class="px-6 py-3 text-left">876569</td>
              <td class="px-6 py-3 text-left">Syed Umair</td>
              <td class="px-6 py-3 text-left">hello@tecbrix.com</td>
              <td class="px-6 py-3 text-left">Developer</td>
              <td class="px-6 py-3 text-left">4250-876545-9</td>
              <td class="px-6 py-3 text-left">Action here</td>
            </tr>
            <tr className="whitespace-nowrap border-b-2">
              <td class="px-6 py-3 text-left">Photo</td>
              <td class="px-6 py-3 text-left">876569</td>
              <td class="px-6 py-3 text-left">Syed Umair</td>
              <td class="px-6 py-3 text-left">hello@tecbrix.com</td>
              <td class="px-6 py-3 text-left">Developer</td>
              <td class="px-6 py-3 text-left">4250-876545-9</td>
              <td class="px-6 py-3 text-left">Action here</td>
            </tr>
            <tr className="whitespace-nowrap border-b-2">
              <td class="px-6 py-3 text-left">Photo</td>
              <td class="px-6 py-3 text-left">876569</td>
              <td class="px-6 py-3 text-left">Syed Umair</td>
              <td class="px-6 py-3 text-left">hello@tecbrix.com</td>
              <td class="px-6 py-3 text-left">Developer</td>
              <td class="px-6 py-3 text-left">4250-876545-9</td>
              <td class="px-6 py-3 text-left">Action here</td>
            </tr>
            <tr className="whitespace-nowrap border-b-2">
              <td class="px-6 py-3 text-left">Photo</td>
              <td class="px-6 py-3 text-left">876569</td>
              <td class="px-6 py-3 text-left">Syed Umair</td>
              <td class="px-6 py-3 text-left">hello@tecbrix.com</td>
              <td class="px-6 py-3 text-left">Developer</td>
              <td class="px-6 py-3 text-left">4250-876545-9</td>
              <td class="px-6 py-3 text-left">Action here</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpDataSheet
