import { useState, useEffect } from "react";
import Time from "./components/Time";
import { Divider, Button, Modal, Form, Select, notification, List } from "antd";
const { Option } = Select;
import timezone from "./data/timezone";

function App() {
  const [time, setTime] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    const citiesId = values.cities;
    const cities = citiesId.map((id) =>
      timezone.find((city) => city.id === id)
    );
    // get json data from local storage
    const citiesData = JSON.parse(localStorage.getItem("citiesData"));
    // check if citiesData is empty
    if (citiesData) {
      // check if cities already exist in local storage
      const isExist = citiesData.some((city) =>
        cities.some((c) => c.id === city.id)
      );
      if (isExist) {
        notification.error({
          description: "Cities already exist in the list",
        });
      } else {
        // add new cities to local storage
        localStorage.setItem(
          "citiesData",
          JSON.stringify([...citiesData, ...cities])
        );
        setData([...citiesData, ...cities]);
        // show notification
        notification.success({
          description: "Cities added successfully",
        });
        form.resetFields();
        handleCancel();
      }
    } else {
      localStorage.setItem("citiesData", JSON.stringify(cities));
      setData(cities);
      notification.success({
        description: "Cities added successfully",
      });
      form.resetFields();
      handleCancel();
    }
  };

  useEffect(() => {
    // get cities data from local storage
    const citiesData = JSON.parse(localStorage.getItem("citiesData"));
    // check if citiesData is empty
    if (citiesData) {
      // set data to citiesData
      setData(citiesData);
    } else {
      setData([]);
    }
  }, []);

  useEffect(() => {
    let TimeId = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(TimeId);
    };
  });

  const convertTime = (timezone) => {
    const localTime = new Date(
      time.toLocaleString("en-US", { timeZone: timezone })
    );
    const localTimeString = localTime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return localTimeString;
  };

  const deleteCity = (id) => {
    const citiesData = JSON.parse(localStorage.getItem("citiesData"));
    const newCitiesData = citiesData.filter((city) => city.id !== id);
    localStorage.setItem("citiesData", JSON.stringify(newCitiesData));
    setData(newCitiesData);
    notification.success({
      description: "City deleted successfully",
    });
  };

  return (
    <>
    <div className="p-6 flex flex-col h-screen">
      <header>
        <Time time={time.toLocaleTimeString()} />
        <Divider orientation="right">
          <Button
            type="primary"
            onClick={showModal}
            shape="circle"
            size="large"
          >
            <h1 className="font-bold text-xl text-white">+</h1>
          </Button>
        </Divider>
      </header>
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              actions={[
                <button onClick={() => deleteCity(item.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-red-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>,
              ]}
            >
              <List.Item.Meta
                title={convertTime(item.timezone)}
                description={item.city}
              />
            </List.Item>
          )}
        />
      </main>
      <footer class="text-center text-sm flex justify-center space-x-2">
        <a href="https://twitter.com/n4ze3m" target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
            />
          </svg>
        </a>
        <a
        href="https://github.com/nazeemnato"
        target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"
            />
          </svg>
        </a>
      </footer>
    </div>
      <Modal
        title="Select Cities"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <Form onFinish={onFinish} form={form}>
          <Form.Item
            label="Cities"
            name="cities"
            rules={[{ required: true, message: "Please select a city" }]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              filterOption={(input, option) => {
                return (
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0 ||
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                );
              }}
            >
              {timezone.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.city}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      </>
  );
}

export default App;
