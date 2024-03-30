import { FC, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { ILists } from "../types/types";
import { PiDotsThreeVerticalLight } from "react-icons/pi";
import ListOptionsModal from "../components/modalWindows/ListOptionsModal";
import { instance } from "../api/axios.api";
import NewListModal from "../components/modalWindows/NewListModal";
import { takeId, takeTitle } from "../features/list/listSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import NewTaskModal from "../components/modalWindows/NewTaskModal";

export const updateListsAfterDelete = async (
  setLists: React.Dispatch<React.SetStateAction<ILists[]>>
) => {
  try {
    const response = await instance.get("/lists"); // Получение обновленного списка с сервера
    setLists(response.data); // Обновление состояния списка
  } catch (error) {
    console.error("Error updating lists after delete:", error);
  }
};

const Tasks: FC = () => {
  const listsFatch = useLoaderData() as ILists[];
  const [lists, setLists] = useState<ILists[]>(listsFatch);
  const [showOptions, setShowOptions] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [selectedlistTitle, setSelectedlistTitle] = useState<string | null>(
    null
  );

  const [visibleModalRename, setVisibleModalRename] = useState<boolean>(false);
  const [visibleTaskModal, setVisibleTaskModal] = useState<boolean>(false);
 

  const isvisibleModal = useAppSelector(
    (state) => state.renameListModalWindow.isVisible
  );
  useEffect(() => {
    setVisibleModalRename((prev) => !prev);
  }, [isvisibleModal]);

  const dispatch = useAppDispatch();

  const updateListsAfterAddNewList = async () => {
    try {
      const response = await instance.get("/lists"); // Получение обновленного списка с сервера
      setLists(response.data); // Обновление состояния списка
    } catch (error) {
      console.error("Error updating lists after add new list:", error);
    }
  };
  updateListsAfterAddNewList();

  const handleOpenOptions = (
    e: React.MouseEvent<HTMLButtonElement>,
    listId: number,
    listTitle: string
  ) => {
    dispatch(takeTitle(listTitle));
    dispatch(takeId(listId));
    setShowOptions(true);
    setSelectedListId(listId);
    setSelectedlistTitle(listTitle);
    setModalPosition({ x: e.clientX, y: e.clientY });
  };

  const handleCloseOptions = () => {
    setShowOptions(false);
    setSelectedListId(null); // Сброс выбранного listId при закрытии модального окна
  };

  const handleAddTask =()=>{
    setVisibleTaskModal(true)
    
  }
  return (
    <div className="mt-5 rounded-md grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 bg-slate-800 p-4">
      {lists.map((list) => (
        <div
          key={list.id}
          className="rounded-md bg-slate-700 flex flex-col p-2"
        >
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg">{list.title}</h2>
            <button
              onClick={(e) => handleOpenOptions(e, list.id!, list.title!)}
            >
              <PiDotsThreeVerticalLight size={20} />
            </button>
          </div>

          <button onClick={handleAddTask} className="btn btn-green m-auto">Add new Task</button>
          <ListOptionsModal
            listId={selectedListId}
            visible={showOptions}
            onClose={handleCloseOptions}
            x={modalPosition.x}
            y={modalPosition.y}
            updateListsAfterDelete={() => updateListsAfterDelete(setLists)}
          />
            {visibleTaskModal && (
        <NewTaskModal
          type="post"
          listId={list.id!}
         
          setVisibleTaskModal={setVisibleTaskModal}
        />
      )}
        </div>
      ))}
      {/* Rename List Modal */}
      {visibleModalRename && (
        <NewListModal
          type="patch"
          setVisibleModal={setVisibleModalRename}
          id={selectedListId!}
          title={selectedlistTitle!}
        />
      )}
    
    </div>
  );
};
export default Tasks;
