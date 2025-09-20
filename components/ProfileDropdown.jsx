"use client";
import React from "react";
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar, HStack, VStack, Text, Box, IconButton, useColorModeValue, } from "@chakra-ui/react";
import { ChevronDownIcon, SettingsIcon, AtSignIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useAuth } from "@/hooks/useAuth";
import { signOutUser } from "@/lib/firebase/auth";

export default function ProfileDropdown() {
  const { user } = useAuth();
  
  // Static data for now - will be dynamic later
  const userName = "John Doe"; // Static for now
  const profileImage = null; // Static for now - will use user.photoURL when available

  const menuBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleMyAccount = () => {
    // TODO: Navigate to account page
    console.log("Navigate to My Account");
  };

  const handleSettings = () => {
    // TODO: Navigate to settings page
    console.log("Navigate to Settings");
  };

  if (!user) return null;

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        variant="ghost"
        size="sm"
        icon={
          <HStack spacing={2}>
            <Avatar
              size="sm"
              name={userName}
              src={profileImage || user.photoURL}
              bg="teal.500"
            />
            <ChevronDownIcon />
          </HStack>
        }
        _hover={{ bg: "gray.100" }}
        _active={{ bg: "gray.200" }}
      />
      
      <MenuList
        bg={menuBg}
        borderColor={borderColor}
        boxShadow="lg"
        minW="240px"
        py={2}
      >
        {/* User Info Section */}
        <Box px={4} py={3}>
          <HStack spacing={3}>
            <Avatar
              size="md"
              name={userName}
              src={profileImage || user.photoURL}
              bg="teal.500"
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                {userName}
              </Text>
              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                {user.email}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <MenuDivider />

        {/* Menu Items */}
        <MenuItem
          icon={<AtSignIcon boxSize={4} />}
          onClick={handleMyAccount}
          fontSize="sm"
          _hover={{ bg: "gray.50" }}
        >
          My Account
        </MenuItem>

        <MenuItem
          icon={<SettingsIcon boxSize={4} />}
          onClick={handleSettings}
          fontSize="sm"
          _hover={{ bg: "gray.50" }}
        >
          Settings
        </MenuItem>

        <MenuDivider />

        <MenuItem
          icon={<ExternalLinkIcon boxSize={4} />}
          onClick={handleSignOut}
          fontSize="sm"
          color="red.500"
          _hover={{ bg: "red.50" }}
        >
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
