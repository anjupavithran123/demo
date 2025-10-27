// import a quick test component
const TestWorkspace = () => <div style={{padding:20,color:'#000'}}>WORKSPACE TEST - visible</div>;

// then in Routes:
<Route path="/workspace/:id" element={<TestWorkspace />} />
