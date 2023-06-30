import React, { useState, useEffect } from 'react';


function App() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = () => {
    // Fetch users from API and update the users state
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.log(error));
  };

  const handleDelete = () => {
    // Implement delete functionality here
    console.log('Delete selected rows:', selectedRows);
    // Reset selected rows
    setSelectedRows([]);
  };

  const handleEdit = (id) => {
    // Implement edit functionality here
    console.log(`Edit user with id ${id}`);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (event, userId) => {
    if (event.target.checked) {
      setSelectedRows(prevSelectedRows => [...prevSelectedRows, userId]);
    } else {
      setSelectedRows(prevSelectedRows =>
        prevSelectedRows.filter(selectedId => selectedId !== userId)
      );
    }
  };

  const handleDeleteSelected = () => {
    // Perform delete operation for selectedRows
    console.log('Deleting selected rows:', selectedRows);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      const currentPageUsers = users.map((user) => user.id);
      setSelectedRows(currentPageUsers);
      setSelectAll(true);
    }
  };

  
  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  // Filter the users based on the search term
  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const itemsPerPage = 10;
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="App">
      <div className="search-bar">
      <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
    </div>
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {visibleUsers.map(user => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(user.id)}
                  onChange={event => handleCheckboxChange(event, user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
                <button onClick={() => handleEdit(user.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     
      <div className="pagination">
      {selectedRows.length > 0 && (
        <button className="delete-selected" onClick={handleDelete}>
          Delete Selected
        </button>
      )}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            className={currentPage === page ? 'active' : ''}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      
    </div>
  );
}

export default App;
